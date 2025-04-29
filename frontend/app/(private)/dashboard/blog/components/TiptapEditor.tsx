'use client'


import Color from '@tiptap/extension-color'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextStyle from '@tiptap/extension-text-style'
import TextAlign from '@tiptap/extension-text-align'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Strikethrough,
  Video
} from 'lucide-react'
import { Video as VideoExtension } from './video'
import { Button } from '@/shadcn/ui/button'
import axios from 'axios'
import { toast } from 'sonner'

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
}

const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
      }),
      BulletList.configure({
        keepMarks: true,
        keepAttributes: false,
      }),
      OrderedList.configure({
        keepMarks: true,
        keepAttributes: false,
      }),
      ListItem.configure({
        HTMLAttributes: {
          class: 'my-2',
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
      VideoExtension,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'Write something...',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  const getPresignedUrl = async (file: File) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/media/upload-url`, {
        fileName: file.name,
        fileType: file.type,
      });
      return {
        presignedUrl: response.data.data.presignedUrl,
        key: response.data.data.key,
      };
    } catch (error) {
      console.error('Error getting presigned URL:', error);
      toast.error('Failed to get upload URL');
      throw error;
    }
  };

  const uploadToS3 = async (file: File, presignedUrl: string) => {
    try {
      await axios.put(presignedUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
      });
      // Return the base URL (without query parameters)
      return presignedUrl.split('?')[0];
    } catch (error) {
      console.error('Error uploading to S3:', error);
      toast.error('Failed to upload video');
      throw error;
    }
  };

  const getPreviewUrl = async (key: string) => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/media/view-url/${Buffer.from(key).toString('base64')}`);
    return response.data.data.viewUrl;
  };

  const handleVideoUpload = async (file: File) => {
    try {
      toast.info('Uploading video...');
      const { presignedUrl, key } = await getPresignedUrl(file);
      await uploadToS3(file, presignedUrl);
      
      // The S3 URL we need to serve through our backend to get a signed URL
      const videoUrl = await getPreviewUrl(key);
      
      editor?.commands.setVideo(videoUrl);
      toast.success('Video uploaded successfully');
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error('Failed to upload video');
    }
  };

  const addVideo = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = async (event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        await handleVideoUpload(file);
      }
    };
    input.click();
  }

  return (
    <div className="">
      <div className="flex flex-wrap gap-2 p-4 border-b">
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-accent' : ''}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-accent' : ''}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'bg-accent' : ''}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-accent' : ''}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-accent' : ''}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            const url = window.prompt('Enter the URL')
            if (url) {
              editor.chain().focus().setLink({ href: url }).run()
            }
          }}
          className={editor.isActive('link') ? 'bg-accent' : ''}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            const url = window.prompt('Enter the image URL')
            if (url) {
              editor.chain().focus().setImage({ src: url }).run()
            }
          }}
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={addVideo}
        >
          <Video className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={editor.isActive({ textAlign: 'left' }) ? 'bg-accent' : ''}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={editor.isActive({ textAlign: 'center' }) ? 'bg-accent' : ''}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={editor.isActive({ textAlign: 'right' }) ? 'bg-accent' : ''}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>
      <div 
        className="p-4"
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          const files = Array.from(e.dataTransfer.files);
          const videoFile = files.find(file => file.type.startsWith('video/'));
          
          if (videoFile) {
            await handleVideoUpload(videoFile);
          }
        }}
      >
        <EditorContent 
          editor={editor} 
          className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] [&_.is-editor-empty:first-child::before]:text-gray-400 [&_.is-editor-empty:first-child::before]:float-left [&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror]:outline-none [&_.ProseMirror:focus]:outline-none [&_.ProseMirror_iframe]:w-full [&_.ProseMirror_iframe]:aspect-video [&_.ProseMirror_iframe]:rounded-lg [&_.ProseMirror_iframe]:my-4" 
        />
      </div>
    </div>
  )
}

export default TiptapEditor 