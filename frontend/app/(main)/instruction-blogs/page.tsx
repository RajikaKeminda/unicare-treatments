'use client'

import { useState, useRef, useEffect } from 'react'
import { FiSearch, FiFilter, FiCheck, FiHeart, FiMessageCircle, FiShare2, FiEye, FiCopy } from 'react-icons/fi'
import { format } from 'date-fns'

interface Post {
  id: string
  title: string
  content: string
  thumbnail: string
  createdAt: string
  updatedAt: string
  category: string
  author: {
    name: string
    avatar: string
  }
  stats: {
    views: number
    likes: number
    comments: number
  }
}

const categories = [
  'All',
  'Technology',
  'Health',
  'Lifestyle',
  'Business',
  'Education',
  'Entertainment',
  'Sports'
]

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      title: 'Getting Started with Next.js',
      content: 'Learn how to build modern web applications with Next.js...',
      thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      createdAt: '2024-03-20T10:00:00Z',
      updatedAt: '2024-03-20T10:00:00Z',
      category: 'Technology',
      author: {
        name: 'John Doe',
        avatar: 'https://ui-avatars.com/api/?name=John+Doe',
      },
      stats: {
        views: 1234,
        likes: 89,
        comments: 23,
      },
    },
    {
      id: '2',
      title: 'Healthy Living Tips',
      content: 'Discover the best practices for maintaining a healthy lifestyle...',
      thumbnail: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      createdAt: '2024-03-19T15:30:00Z',
      updatedAt: '2024-03-19T15:30:00Z',
      category: 'Health',
      author: {
        name: 'Jane Smith',
        avatar: 'https://ui-avatars.com/api/?name=Jane+Smith',
      },
      stats: {
        views: 856,
        likes: 45,
        comments: 12,
      },
    },
  ])

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

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const postsPerPage = 9
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  )

  const handleCopyLink = async (postId: string) => {
    const url = `${window.location.origin}/blog/${postId}`
    await navigator.clipboard.writeText(url)
    // You could add a toast notification here
  }

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, stats: { ...post.stats, likes: post.stats.likes + 1 } }
        : post
    ))
  }

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedPosts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative h-48">
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => handleCopyLink(post.id)}
                  className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <FiCopy className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm text-gray-600">{post.author.name}</span>
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
                {post.content}
              </p>
              
              {/* Stats and Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <FiHeart className="w-4 h-4" />
                    <span className="text-sm">{post.stats.likes}</span>
                  </button>
                  <div className="flex items-center gap-1 text-gray-600">
                    <FiMessageCircle className="w-4 h-4" />
                    <span className="text-sm">{post.stats.comments}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <FiEye className="w-4 h-4" />
                    <span className="text-sm">{post.stats.views}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleCopyLink(post.id)}
                  className="flex items-center gap-1 text-gray-600 hover:text-purple-600 transition-colors"
                >
                  <FiShare2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
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
      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <FiSearch className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
          <p className="text-gray-500">
            {searchQuery || selectedCategory !== 'All'
              ? 'Try adjusting your search query or filters'
              : 'Check back later for new posts'}
          </p>
        </div>
      )}
    </div>
  )
}
