'use client'

import { format } from 'date-fns'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FiArrowRight, FiCopy, FiEye, FiHeart, FiMessageCircle, FiShare2 } from 'react-icons/fi'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { toast } from "sonner"
import Comments from './components/Comments'

interface SessionUser {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  role?: string;
}

interface Comment {
  _id: string
  content: string
  createdAt: string
  author: {
    _id: string
    name: string
    email: string
  }
  likes: string[]
  dislikes: string[]
  replies: Comment[]
  parentCommentId?: string
  postId: string
}

interface Post {
  _id: string
  title: string
  content: string
  thumbnail: string
  thumbnailUrl?: string
  createdAt: string
  updatedAt: string
  category: string
  author: {
    _id: string
    name: string
    email: string
  }
  views: number
  likes: string[]
  comments: Comment[]
  isPublished: boolean
}

interface Product {
  _id: string
  name: string
  description: string
  s3Key?: string
}

export default function BlogViewPage() {
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id || ''
  const { data: session } = useSession()
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [suggestedPosts, setSuggestedPosts] = useState<Post[]>([])
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([])

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/blog/${id}`)
        const thumbnailUrl = await getThumbnailUrl(response.data.data.thumbnail)
        setPost({ ...response.data.data, thumbnailUrl })
        setError(null)
      } catch (err) {
        setError('Failed to load blog post')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPost()
      fetchSimilarPosts()
      fetchPostRecommendations()
    }
  }, [id])

  const fetchSimilarPosts = async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/blog/${id}/similar`)
    const thumbnailUrls = await Promise.all(response.data.data.map(async (post: Post) => await getThumbnailUrl(post.thumbnail)))
    console.log(thumbnailUrls)
    setSuggestedPosts(response.data.data.map((post: Post, index: number) => ({ ...post, thumbnail: thumbnailUrls[index] })))
  }

  const fetchPostRecommendations = async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/blog/${id}/recommendations`)
    setSuggestedProducts(response.data.data)
  }

  const getThumbnailUrl = async (thumbnailPath: string): Promise<string> => {
    if (thumbnailPath.startsWith('http')) {
      return thumbnailPath
    }
    
    try {
      const key = thumbnailPath
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/media/view-url/${Buffer.from(key).toString('base64')}`)
      return response.data.data.viewUrl
    } catch (error) {
      console.error('Error getting thumbnail URL:', error)
      return 'https://via.placeholder.com/400x300?text=Image+Not+Available'
    }
  }

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/comments/post/${id}?page=1&limit=10`)
        setComments(response.data.data.comments)
      } catch (err) {
        console.error('Failed to load comments:', err)
      }
    }

    if (id) {
      fetchComments()
    }
  }, [id])

  const handleLike = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/blog/${id}/like`)
      
      // Update post in state with new likes
      setPost(prev => {
        if (!prev) return prev
        return { ...prev, likes: response.data.data.likes }
      })
      
      toast.success('Post like updated')
    } catch (err) {
      toast.error('Failed to like post')
      console.error(err)
    }
  }

  const handleCopyLink = async () => {
    const url = window.location.href
    await navigator.clipboard.writeText(url)
    toast.success('Link copied to clipboard')
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  }

  if (error || !post) {
    return <div className="max-w-4xl mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
      <p className="text-gray-700">{error || 'Blog post not found'}</p>
      <Link href="/instruction-blogs" className="mt-4 inline-block px-4 py-2 bg-purple-600 text-white rounded-lg">
        Back to Blogs
      </Link>
    </div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
            {post.category}
          </span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-gray-600">
          <div className="flex items-center gap-2">
            <img
              src={`https://ui-avatars.com/api/?name=Avatar`}
              alt={'Avatar'}
              className="w-6 h-6 rounded-full"
            />
            <span>{'Doctor'}</span>
          </div>
          <span>•</span>
          <span>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</span>
        </div>
      </div>

      {/* Featured Image */}
      <div className="relative h-[400px] mb-8 rounded-xl overflow-hidden">
        <img
          src={post.thumbnailUrl || 'https://via.placeholder.com/1200x630?text=No+Image'}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <button
            onClick={handleCopyLink}
            className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
          >
            <FiCopy className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div 
        className="prose prose-lg max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Reactions */}
      <div className="flex items-center gap-6 py-6 border-y border-gray-200 mb-12">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 transition-colors ${
            session && session.user && post.likes.includes((session.user as SessionUser).id)
              ? 'text-red-500'
              : 'text-gray-600 hover:text-red-500'
          }`}
        >
          <FiHeart className="w-5 h-5" />
          <span>{post.likes.length}</span>
        </button>
        <div className="flex items-center gap-2 text-gray-600">
          <FiMessageCircle className="w-5 h-5" />
          <span>{post.comments.length}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <FiShare2 className="w-5 h-5" />
        </div>
      </div>

      {/* Comments Section */}
      <Comments postId={id} initialComments={comments} />

      {/* Suggested Posts */}
      <div className="mt-16 pt-8 border-t border-gray-200">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Suggested Posts</h2>
          <Link 
            href="/instruction-blogs"
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
          >
            View All
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestedPosts.length > 0 ? (
            suggestedPosts.map((suggestedPost) => (
              <Link 
                key={suggestedPost._id} 
                href={`/instruction-blogs/${suggestedPost._id}`}
                className="group"
              >
                <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-40">
                    <img
                      src={suggestedPost.thumbnail || 'https://via.placeholder.com/300x200?text=No+Image'}
                      alt={suggestedPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                        {suggestedPost.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {suggestedPost.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <FiHeart className="w-4 h-4" />
                        <span>{suggestedPost.likes.length}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiMessageCircle className="w-4 h-4" />
                        <span>{suggestedPost.comments.length}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiEye className="w-4 h-4" />
                        <span>{suggestedPost.views}</span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))
          ) : (
            <p className="col-span-3 text-center text-gray-500 py-8">No suggested posts found</p>
          )}
        </div>

      {/* Recommended Products Section */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recommended Products</h2>
          <Link href="/products" className="flex items-center text-purple-600 hover:text-purple-800 transition-colors">
            View all products <FiArrowRight className="ml-2" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestedProducts.length > 0 ? (
            suggestedProducts.map((product) => (
              <Link 
                key={product._id} 
                href={`/products/${product._id}`}
                className="group"
              >
                <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-40">
                    <img
                      src={product?.s3Key || `https://via.placeholder.com/300x200?text=${encodeURIComponent(product.name)}`}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {product.description}
                    </p>
                    <div className="mt-4 flex justify-end">
                      <span className="inline-flex items-center text-sm font-medium text-purple-600 group-hover:text-purple-800">
                        Learn more <FiArrowRight className="ml-1 w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))
          ) : (
            <p className="col-span-3 text-center text-gray-500 py-8">No recommended products found</p>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}
