'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FiSearch, FiPlus, FiTrash2, FiEdit2, FiEye, FiFilter, FiCheck } from 'react-icons/fi'
import { format } from 'date-fns'
import axios from 'axios'
import Image from 'next/image'

interface Post {
  _id: string
  title: string
  content: string
  thumbnail: string
  thumbnailUrl?: string
  createdAt: string
  updatedAt: string
  category: string
  author: string
  likes: string[]
  comments: string[]
  views: number
  isPublished: boolean
  __v: number
}

interface ApiResponse {
  success: boolean
  data: {
    posts: Post[]
    pagination: {
      total: number
      page: number
      pages: number
    }
  }
}

export default function PostsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const filterRef = useRef<HTMLDivElement>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [categories, setCategories] = useState<string[]>(['All'])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  // Fetch categories from API
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/categories`)
        if (response.data.success) {
          setCategories(['All', ...response.data.data?.map((category: { name: string }) => category.name) || []])
        } else {
          console.error('Failed to fetch categories')
        }
      } catch (err) {
        console.error('Error fetching categories:', err)
      }
    }

    fetchCategories()
  }, [])
  
  // Fetch posts from API
  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true)
        const response = await axios.get<ApiResponse>(`${process.env.NEXT_PUBLIC_BASE_URL}/blog`)
        if (response.data.success) {
          const data = [];
          for (const post of response.data.data.posts) {
            const thumbnailUrl = await getThumbnailUrl(post.thumbnail)
            data.push({
              ...post,
              thumbnailUrl
            })
          }
          setPosts(data)
          setTotalPages(response.data.data.pagination.pages)
        } else {
          setError('Failed to fetch posts')
        }
      } catch (err) {
        setError('Error connecting to the server')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  // Get thumbnail URL
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

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const postsPerPage = 10
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  )

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/blog/${id}`)
        setPosts(posts.filter(post => post._id !== id))
      } catch (error) {
        console.error('Error deleting post:', error)
        alert('Failed to delete post')
      }
    }
  }

  return (
    <div className="max-w-7xl w-2/3 mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
        <button
          onClick={() => router.push('/dashboard/blog/create-blog')}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          New Post
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`p-2 rounded-lg border transition-colors ${
              selectedCategory !== 'All'
                ? 'bg-purple-50 border-purple-200 text-purple-600'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FiFilter className="w-5 h-5" />
          </button>
          
          {/* Filter Dropdown */}
          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categories
              </div>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category)
                    setIsFilterOpen(false)
                  }}
                  className={`w-full px-3 py-2 text-sm flex items-center justify-between hover:bg-gray-50 ${
                    selectedCategory === category ? 'text-purple-600' : 'text-gray-700'
                  }`}
                >
                  <span>{category}</span>
                  {selectedCategory === category && (
                    <FiCheck className="w-4 h-4" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading posts...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load posts</h3>
          <p className="text-gray-500">{error}</p>
        </div>
      )}

      {/* Posts Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-48">
                <Image
                  src={post.thumbnailUrl || 'https://via.placeholder.com/400x300?text=Image+Not+Available'}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => router.push(`/admin/app/blog/edit/${post._id}`)}
                    className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                  >
                    <FiEdit2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={`https://ui-avatars.com/api/?name=Author`}
                    alt="Author"
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span className="text-sm text-gray-600">Author</span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-400">
                    {format(new Date(post.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                    {post.category}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {post.content.replace(/<[^>]*>/g, '')}
                </p>
                <button
                  onClick={() => router.push(`/instruction-blogs/${post._id}`)}
                  className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  <FiEye className="w-4 h-4" />
                  View Post
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <FiSearch className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
          <p className="text-gray-500">
            {searchQuery || selectedCategory !== 'All'
              ? 'Try adjusting your search query or filters'
              : 'Create your first blog post'}
          </p>
        </div>
      )}
    </div>
  )
}
