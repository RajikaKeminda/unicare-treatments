'use client'

import { useState } from 'react'
import { FiHeart, FiMessageCircle, FiShare2, FiCopy, FiSend, FiThumbsUp, FiThumbsDown } from 'react-icons/fi'
import { format } from 'date-fns'

interface Comment {
  id: string
  content: string
  createdAt: string
  author: {
    name: string
    avatar: string
  }
  likes: number
  dislikes: number
  replies: Comment[]
}

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

export default function BlogViewPage({ params }: { params: { id: string } }) {
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [post, setPost] = useState<Post>({
    id: params.id,
    title: 'Getting Started with Next.js',
    content: `
      <p>Next.js is a powerful framework for building React applications. It provides a great developer experience with features like server-side rendering, static site generation, and API routes.</p>
      
      <h2>Why Choose Next.js?</h2>
      <p>There are many reasons to choose Next.js for your next project:</p>
      <ul>
        <li>Server-side rendering for better performance</li>
        <li>Static site generation for blazing fast pages</li>
        <li>API routes for backend functionality</li>
        <li>File-based routing</li>
        <li>Built-in TypeScript support</li>
      </ul>

      <h2>Getting Started</h2>
      <p>To create a new Next.js project, run:</p>
      <pre><code>npx create-next-app@latest my-app</code></pre>
      
      <p>This will create a new Next.js project with all the necessary dependencies and configuration files.</p>
    `,
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
  })

  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      content: 'Great article! I learned a lot about Next.js.',
      createdAt: '2024-03-20T11:00:00Z',
      author: {
        name: 'Alice Johnson',
        avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson',
      },
      likes: 5,
      dislikes: 0,
      replies: [
        {
          id: '2',
          content: 'Agreed! The examples were very helpful.',
          createdAt: '2024-03-20T11:30:00Z',
          author: {
            name: 'Bob Wilson',
            avatar: 'https://ui-avatars.com/api/?name=Bob+Wilson',
          },
          likes: 2,
          dislikes: 0,
          replies: [],
        },
      ],
    },
  ])

  const handleLike = () => {
    setPost(prev => ({
      ...prev,
      stats: { ...prev.stats, likes: prev.stats.likes + 1 }
    }))
  }

  const handleCopyLink = async () => {
    const url = window.location.href
    await navigator.clipboard.writeText(url)
    // You could add a toast notification here
  }

  const handleCommentLike = (commentId: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, likes: comment.likes + 1 }
      }
      return comment
    }))
  }

  const handleCommentDislike = (commentId: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, dislikes: comment.dislikes + 1 }
      }
      return comment
    }))
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      createdAt: new Date().toISOString(),
      author: {
        name: 'Current User',
        avatar: 'https://ui-avatars.com/api/?name=Current+User',
      },
      likes: 0,
      dislikes: 0,
      replies: [],
    }

    if (replyTo) {
      setComments(prev => prev.map(comment => {
        if (comment.id === replyTo) {
          return { ...comment, replies: [...comment.replies, comment] }
        }
        return comment
      }))
    } else {
      setComments(prev => [...prev, comment])
    }

    setNewComment('')
    setReplyTo(null)
  }

  const renderComment = (comment: Comment) => (
    <div key={comment.id} className="space-y-4">
      <div className="flex gap-4">
        <img
          src={comment.author.avatar}
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
                onClick={() => handleCommentLike(comment.id)}
                className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <FiThumbsUp className="w-4 h-4" />
                <span className="text-sm">{comment.likes}</span>
              </button>
              <button
                onClick={() => handleCommentDislike(comment.id)}
                className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors"
              >
                <FiThumbsDown className="w-4 h-4" />
                <span className="text-sm">{comment.dislikes}</span>
              </button>
              <button
                onClick={() => setReplyTo(comment.id)}
                className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
              >
                Reply
              </button>
            </div>
          </div>
          {comment.replies.length > 0 && (
            <div className="ml-8 mt-4 space-y-4">
              {comment.replies.map(reply => renderComment(reply))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

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
              src={post.author.avatar}
              alt={post.author.name}
              className="w-6 h-6 rounded-full"
            />
            <span>{post.author.name}</span>
          </div>
          <span>•</span>
          <span>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</span>
        </div>
      </div>

      {/* Featured Image */}
      <div className="relative h-[400px] mb-8 rounded-xl overflow-hidden">
        <img
          src={post.thumbnail}
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
          className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
        >
          <FiHeart className="w-5 h-5" />
          <span>{post.stats.likes}</span>
        </button>
        <div className="flex items-center gap-2 text-gray-600">
          <FiMessageCircle className="w-5 h-5" />
          <span>{post.stats.comments}</span>
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
            src="https://ui-avatars.com/api/?name=Current+User"
            alt="Your avatar"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={replyTo ? "Write a reply..." : "Write a comment..."}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={3}
            />
            <div className="flex justify-end mt-2">
              {replyTo && (
                <button
                  type="button"
                  onClick={() => setReplyTo(null)}
                  className="text-sm text-gray-600 hover:text-gray-900 mr-2"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <FiSend className="w-4 h-4" />
                {replyTo ? 'Reply' : 'Comment'}
              </button>
            </div>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-8">
          {comments.map(comment => renderComment(comment))}
        </div>
      </div>
    </div>
  )
}
