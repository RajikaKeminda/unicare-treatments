'use client'

import { useState, useEffect } from 'react'
import { FiImage, FiVideo, FiCopy, FiTrash2, FiUpload, FiFilter, FiX, FiFile } from 'react-icons/fi'
import { format } from 'date-fns'
import axios from 'axios'

interface GalleryItem {
  _id: string
  url: string
  type: string
  createdAt: string
  updatedAt: string
  viewUrl?: string
}

const categories = [
  'All',
  'Images',
  'Videos',
  'Documents',
]

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [items, setItems] = useState<GalleryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/media`)
        
        if (response.data.success) {
          // Get view URLs for all media items
          const mediaWithViewUrls = await Promise.all(
            response.data.data.map(async (item: GalleryItem) => {
              const viewUrl = await getMediaViewUrl(item.url)
              return { ...item, viewUrl }
            })
          )
          
          setItems(mediaWithViewUrls)
        }
      } catch (error) {
        console.error('Error fetching media:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMedia()
  }, [])

  const getMediaViewUrl = async (url: string): Promise<string> => {
    try {
      const key = url
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/media/view-url/${Buffer.from(key).toString('base64')}`)
      return response.data.data.viewUrl
    } catch (error) {
      console.error('Error getting media view URL:', error)
      return 'https://via.placeholder.com/400x300?text=Media+Not+Available'
    }
  }

  const getMediaType = (type: string): 'image' | 'video' | 'document' => {
    if (type.startsWith('image/')) return 'image'
    if (type.startsWith('video/')) return 'video'
    return 'document'
  }

  const getMediaTitle = (url: string): string => {
    const parts = url.split('/')
    return parts[parts.length - 1]
  }

  const filteredItems = items.filter(item => {
    const mediaType = getMediaType(item.type)
    const matchesCategory = 
      selectedCategory === 'All' || 
      (selectedCategory === 'Images' && mediaType === 'image') ||
      (selectedCategory === 'Videos' && mediaType === 'video') ||
      (selectedCategory === 'Documents' && mediaType === 'document')
    
    const title = getMediaTitle(item.url)
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesCategory && matchesSearch
  })

  const handleCopyLink = async (url: string) => {
    await navigator.clipboard.writeText(url)
    // You could add a toast notification here
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/media/${id}`)
        setItems(prev => prev.filter(item => item._id !== id))
        // You could add a toast notification here
      } catch (error) {
        console.error('Error deleting media:', error)
        // You could add an error toast notification here
      }
    }
  }

  const formatFileSize = (): string => {
    // This would ideally come from the API
    return '~2 MB'
  }

  return (
    <div className="p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
          <p className="text-gray-600">Manage your media files</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          <FiUpload className="w-4 h-4" />
          Upload Media
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <FiFilter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Category Filter */}
      {isFilterOpen && (
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
          <button
            onClick={() => setIsFilterOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading media...</p>
        </div>
      )}

      {/* Gallery Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => {
            const mediaType = getMediaType(item.type)
            const title = getMediaTitle(item.url)
            
            return (
              <div
                key={item._id}
                className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Media Preview */}
                <div className="relative aspect-video">
                  {mediaType === 'image' ? (
                    <img
                      src={item.viewUrl}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : mediaType === 'video' ? (
                    <div className="relative w-full h-full">
                      <video
                        src={item.viewUrl}
                        className="w-full h-full object-cover"
                        preload="metadata"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                        <FiVideo className="w-12 h-12 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center bg-gray-100">
                      <FiFile className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleCopyLink(item.viewUrl || '')}
                      className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <FiCopy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 bg-white rounded-full text-red-600 hover:bg-gray-100 transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Item Info */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {mediaType === 'image' ? (
                      <FiImage className="w-4 h-4 text-purple-600" />
                    ) : mediaType === 'video' ? (
                      <FiVideo className="w-4 h-4 text-blue-600" />
                    ) : (
                      <FiFile className="w-4 h-4 text-orange-600" />
                    )}
                    <span className="text-sm font-medium text-gray-900">{title}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}</span>
                    <span>{formatFileSize()}</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {format(new Date(item.createdAt), 'MMM d, yyyy')}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredItems.length === 0 && (
        <div className="text-center py-12">
          <FiImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No media found</h3>
          <p className="text-gray-600">
            {searchQuery || selectedCategory !== 'All'
              ? 'Try adjusting your search or filter criteria'
              : 'Upload your first media file to get started'}
          </p>
        </div>
      )}
    </div>
  )
}
