'use client'

import { useState, useEffect, useRef } from 'react'
import axios, { AxiosResponse } from 'axios'
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiX, FiCheck } from 'react-icons/fi'
import { z } from 'zod'

interface Category {
  _id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

interface ApiResponse {
  success: boolean
  data: Category | Category[]
  message?: string
  error?: string
}

// Add this before the CategoryPage component
const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').trim(),
  description: z.string().trim().optional()
})

type CategoryFormData = z.infer<typeof categorySchema>

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  
  // For create/edit modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryName, setCategoryName] = useState('')
  const [categoryDescription, setCategoryDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  // For delete confirmation
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null)
  
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await axios.get<ApiResponse>(`${process.env.NEXT_PUBLIC_BASE_URL}/categories`)
      if (response.data.success) {
        setCategories(response.data.data as Category[])
      } else {
        setError('Failed to fetch categories')
      }
    } catch (err) {
      setError('Error connecting to the server')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = () => {
    setEditingCategory(null)
    setCategoryName('')
    setCategoryDescription('')
    setValidationError(null)
    setIsModalOpen(true)
  }

  const openEditModal = (category: Category) => {
    setEditingCategory(category)
    setCategoryName(category.name)
    setCategoryDescription(category.description || '')
    setValidationError(null)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingCategory(null)
    setCategoryName('')
    setCategoryDescription('')
    setValidationError(null)
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      setValidationError(null)

      const formData: CategoryFormData = {
        name: categoryName,
        description: categoryDescription || undefined
      }

      const validationResult = categorySchema.safeParse(formData)
      
      if (!validationResult.success) {
        setValidationError(validationResult.error.errors[0].message)
        return
      }

      const data = validationResult.data

      let response: AxiosResponse<ApiResponse>

      if (editingCategory) {
        // Update existing category
        response = await axios.put<ApiResponse>(
          `${process.env.NEXT_PUBLIC_BASE_URL}/categories/${editingCategory._id}`,
          data
        )
        
        if (response.data.success) {
          setCategories(categories.map(cat => 
            cat._id === editingCategory._id ? response.data.data as Category : cat
          ))
        }
      } else {
        // Create new category
        response = await axios.post<ApiResponse>(`${process.env.NEXT_PUBLIC_BASE_URL}/categories`, data)
        
        if (response.data.success) {
          setCategories([...categories, response.data.data as Category])
        }
      }

      closeModal()
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } }
      setValidationError(error.response?.data?.error || 'An error occurred')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmDelete = (id: string) => {
    setIsDeletingId(id)
  }

  const cancelDelete = () => {
    setIsDeletingId(null)
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/categories/${id}`)
      setCategories(categories.filter(cat => cat._id !== id))
      setIsDeletingId(null)
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Failed to delete category')
    }
  }

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="max-w-7xl w-full mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Blog Categories</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          New Category
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load categories</h3>
          <p className="text-gray-500">{error}</p>
        </div>
      )}

      {/* Categories Table */}
      {!loading && !error && (
        <>
          {filteredCategories.length > 0 ? (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCategories.map((category) => (
                    <tr key={category._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 line-clamp-2">{category.description || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {isDeletingId === category._id ? (
                          <div className="flex items-center justify-end space-x-2">
                            <span className="text-red-600 text-xs mr-2">Confirm delete?</span>
                            <button
                              onClick={() => handleDelete(category._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FiCheck className="w-5 h-5" />
                            </button>
                            <button
                              onClick={cancelDelete}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <FiX className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end space-x-3">
                            <button
                              onClick={() => openEditModal(category)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <FiEdit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => confirmDelete(category._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery ? 'No categories match your search criteria' : 'Get started by creating your first category'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div ref={modalRef} className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter category name"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter category description (optional)"
                />
              </div>
              {validationError && (
                <div className="text-red-500 text-sm">{validationError}</div>
              )}
            </div>
            <div className="px-6 py-3 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  editingCategory ? 'Update Category' : 'Create Category'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
