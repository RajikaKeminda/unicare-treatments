'use client'

import { format } from 'date-fns'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FiArrowRight, FiCopy, FiEye, FiHeart, FiMessageCircle, FiSend, FiShare2, FiThumbsDown, FiThumbsUp } from 'react-icons/fi'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import axios from 'axios'

import { toast } from "sonner";

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
}

export default function BlogViewPage() {
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id
  const { data: session } = useSession()
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [suggestedPosts, setSuggestedPosts] = useState<Post[]>([])
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([])
  const [page, setPage] = useState(1)
  const [commentSubmitting, setCommentSubmitting] = useState(false)

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
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/comments/post/${id}?page=${page}&limit=10`)
        setComments(response.data.data.comments)
      } catch (err) {
        console.error('Failed to load comments:', err)
      }
    }

    if (id) {
      fetchComments()
    }
  }, [id, page])

  const handleLike = async () => {
    // if (!session) {
    //   toast.error('Please sign in to like this post')
    //   return
    // }

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

  const handleCommentLike = async (commentId: string) => {
    // if (!session) {
    //   toast.error('Please sign in to like this comment')
    //   return
    // }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/comments/${commentId}/like`)
      
      // Update comments state with the updated comment
      setComments(prev => {
        return prev.map(comment => {
          if (comment._id === commentId) {
            return { ...comment, likes: response.data.data.likes }
          }
          
          // Check if the comment is in replies
          if (comment.replies && comment.replies.length > 0) {
            const updatedReplies = comment.replies.map(reply => {
              if (reply._id === commentId) {
                return { ...reply, likes: response.data.data.likes }
              }
              return reply
            })
            
            return { ...comment, replies: updatedReplies }
          }
          
          return comment
        })
      })
    } catch (err) {
      toast.error('Failed to like comment')
      console.error(err)
    }
  }

  const handleCommentDislike = async (commentId: string) => {
    // if (!session) {
    //   toast.error('Please sign in to dislike this comment')
    //   return
    // }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/comments/${commentId}/dislike`)
      
      // Update comments state with the updated comment
      setComments(prev => {
        return prev.map(comment => {
          if (comment._id === commentId) {
            return { ...comment, dislikes: response.data.data.dislikes }
          }
          
          // Check if the comment is in replies
          if (comment.replies && comment.replies.length > 0) {
            const updatedReplies = comment.replies.map(reply => {
              if (reply._id === commentId) {
                return { ...reply, dislikes: response.data.dislikes }
              }
              return reply
            })
            
            return { ...comment, replies: updatedReplies }
          }
          
          return comment
        })
      })
    } catch (err) {
      toast.error('Failed to dislike comment')
      console.error(err)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // if (!session) {
    //   toast.error('Please sign in to comment')
    //   return
    // }
    
    if (!newComment.trim()) return

    try {
      setCommentSubmitting(true)
      
      const commentData = {
        content: newComment,
        postId: id,
        parentCommentId: replyTo || undefined
      }
      
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/comments`, commentData)
      const newCommentData = response.data.data
      
      // If it's a reply, add it to the parent comment's replies
      if (replyTo) {
        setComments(prev => {
          return prev.map(comment => {
            if (comment._id === replyTo) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newCommentData]
              }
            }
            return comment
          })
        })
      } else {
        // If it's a top-level comment, add it to the comments list
        setComments(prev => [newCommentData, ...prev])
      }
      
      // Update post comment count in state
      setPost(prev => {
        if (!prev) return prev
        return {
          ...prev,
          comments: [...prev.comments, newCommentData._id]
        }
      })
      
      toast.success(replyTo ? 'Reply posted successfully' : 'Comment posted successfully')
      setNewComment('')
      setReplyTo(null)
    } catch (err) {
      toast.error('Failed to post comment')
      console.error(err)
    } finally {
      setCommentSubmitting(false)
    }
  }

  const renderComment = (comment: Comment) => (
    <div key={comment._id} className="space-y-4">
      <div className="flex gap-4">
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author.name || '')}`}
          alt={comment.author.name}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-gray-900">{comment.author.name}</span>
              <span className="text-sm text-gray-500">
                {format(new Date(comment.createdAt), 'MMM d, yyyy')}
              </span>
            </div>
            <p className="text-gray-700">{comment.content}</p>
            <div className="flex items-center gap-4 mt-3">
              <button
                onClick={() => handleCommentLike(comment._id)}
                className={`flex items-center gap-1 transition-colors ${
                  comment.likes.includes((session?.user as SessionUser)?.id)
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <FiThumbsUp className="w-4 h-4" />
                <span className="text-sm">{comment.likes.length}</span>
              </button>
              <button
                onClick={() => handleCommentDislike(comment._id)}
                className={`flex items-center gap-1 transition-colors ${
                  session && session.user && comment.dislikes.includes((session.user as SessionUser).id)
                    ? 'text-red-600'
                    : 'text-gray-600 hover:text-red-600'
                }`}
              >
                <FiThumbsDown className="w-4 h-4" />
                <span className="text-sm">{comment.dislikes.length}</span>
              </button>
              <button
                onClick={() => setReplyTo(comment._id)}
                className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
              >
                Reply
              </button>
            </div>
          </div>
          {comment.replies && comment.replies.length > 0 && (
            <div className="ml-8 mt-4 space-y-4">
              {comment.replies.map(reply => renderComment(reply))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

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
            <span>{'Avatar'}</span>
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
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-900">Comments</h2>
        
        {/* Comment Form */}
        <form onSubmit={handleSubmitComment} className="flex gap-4">
          <img
            src={session && session.user ? `https://ui-avatars.com/api/?name=${encodeURIComponent((session.user as SessionUser).name || 'User')}` : 'https://ui-avatars.com/api/?name=Guest'}
            alt={session && session.user ? (session.user as SessionUser).name || 'Your avatar' : 'Guest'}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={"Write a reply..."}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={3}
              disabled={commentSubmitting}
            />
            <div className="flex justify-end mt-2">
              {replyTo && (
                <button
                  type="button"
                  onClick={() => setReplyTo(null)}
                  className="text-sm text-gray-600 hover:text-gray-900 mr-2"
                  disabled={commentSubmitting}
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className={`flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg transition-colors ${
                  commentSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'
                }`}
                disabled={commentSubmitting}
              >
                {commentSubmitting ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <FiSend className="w-4 h-4" />
                    {replyTo ? 'Reply' : 'Comment'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-8">
          {comments.length > 0 ? (
            comments.map(comment => renderComment(comment))
          ) : (
            <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
          )}
        </div>
        
        {/* Load More Comments Button */}
        {comments.length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={() => setPage(prev => prev + 1)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Load More Comments
            </button>
          </div>
        )}
      </div>

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
                      src={`https://via.placeholder.com/300x200?text=${encodeURIComponent(product.name)}`}
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
