import { format } from 'date-fns'
import { FiSend, FiThumbsDown, FiThumbsUp } from 'react-icons/fi'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { toast } from "sonner"
import { useState } from 'react'

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

interface CommentsProps {
  postId: string
  initialComments: Comment[]
}

export default function Comments({ postId, initialComments }: CommentsProps) {
  const { data: session } = useSession()
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [commentSubmitting, setCommentSubmitting] = useState(false)

  const handleCommentLike = async (commentId: string) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/comments/${commentId}/like`, {}, {
        headers: {
          'Authorization': `Bearer ${session?.user?.id}`
        }
      })
      
      setComments(prev => {
        return prev.map(comment => {
          if (comment._id === commentId) {
            return { ...comment, likes: response.data.data.likes }
          }
          
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
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/comments/${commentId}/dislike`)
      
      setComments(prev => {
        return prev.map(comment => {
          if (comment._id === commentId) {
            return { ...comment, dislikes: response.data.data.dislikes }
          }
          
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
    
    if (!newComment.trim()) return

    try {
      setCommentSubmitting(true)
      
      const commentData = {
        content: newComment,
        postId: postId,
        parentCommentId: replyTo || undefined
      }
      
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/comments`, commentData)
      const newCommentData = response.data.data
      
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
        setComments(prev => [newCommentData, ...prev])
      }
      
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

  return (
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
    </div>
  )
} 