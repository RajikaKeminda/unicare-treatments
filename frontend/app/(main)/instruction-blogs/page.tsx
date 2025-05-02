'use client'

import { useState, useRef, useEffect } from 'react'
import { FiSearch, FiFilter, FiCheck, FiHeart, FiMessageCircle, FiShare2, FiEye, FiCopy } from 'react-icons/fi'
import { format } from 'date-fns'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import _ from 'lodash'

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

export default function BlogPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const filterRef = useRef<HTMLDivElement>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<string[]>(['All'])
  const [searchQuery, setSearchQuery] = useState('')

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
    fetchPosts({search: searchQuery, category: selectedCategory === 'All' ? '' : selectedCategory})
  }, [selectedCategory])

  async function fetchPosts(filters: { search?: string, category?: string } = {}) {
    try {
      setLoading(true)
      const response = await axios.get<ApiResponse>(`${process.env.NEXT_PUBLIC_BASE_URL}/blog?search=${filters?.search}&category=${filters?.category}`)
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

  const filteredPosts = posts

  const postsPerPage = 9
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  )

  const handleCopyLink = async (postId: string) => {
    const url = `${window.location.origin}/blog/${postId}`
    await navigator.clipboard.writeText(url)
    // You could add a toast notification here
  }

  const handleLike = async (postId: string) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/blog/${postId}/like`)
      setPosts(posts.map(post => 
        post._id === postId 
          ? { ...post, likes: [...post.likes, 'current-user-id'] }
          : post
      ))
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }


  const searchHandler = _.debounce((value: string) => {
    setSearchQuery(value)
    fetchPosts({ search: value, category: selectedCategory === 'All' ? '' : selectedCategory })
  }, 1000)

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Blog</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover insights, tips, and stories from our team. Stay updated with the latest trends and information.
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search articles..."
            onChange={(e) => searchHandler(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`p-3 rounded-lg border transition-colors ${
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedPosts.map((post) => (
            <article
              onClick={() => router.push(`/instruction-blogs/${post._id}`)}
              key={post._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-48">
                <img
                  src={post.thumbnailUrl || 'https://via.placeholder.com/400x300?text=Image+Not+Available'}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => handleCopyLink(post._id)}
                    className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                  >
                    <FiCopy className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=Author`}
                    alt="Author"
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm text-gray-600">Author</span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-400">
                    {format(new Date(post.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                    {post.category}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {post.content.replace(/<[^>]*>/g, '')}
                </p>
                
                {/* Stats and Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(post._id)}
                      className={`flex items-center gap-1 ${
                        post.likes.includes('current-user-id') 
                          ? 'text-red-500' 
                          : 'text-gray-600 hover:text-red-500'
                      } transition-colors`}
                    >
                      <FiHeart className="w-4 h-4" />
                      <span className="text-sm">{post.likes.length}</span>
                    </button>
                    <div className="flex items-center gap-1 text-gray-600">
                      <FiMessageCircle className="w-4 h-4" />
                      <span className="text-sm">{post.comments.length}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <FiEye className="w-4 h-4" />
                      <span className="text-sm">{post.views}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopyLink(post._id)}
                    className="flex items-center gap-1 text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    <FiShare2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}


      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
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
            {selectedCategory !== 'All'
              ? 'Try adjusting your search query or filters'
              : 'Check back later for new posts'}
          </p>
        </div>
      )}
    </div>
  )
}
