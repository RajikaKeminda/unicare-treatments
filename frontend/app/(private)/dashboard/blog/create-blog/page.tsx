'use client'

import Image from 'next/image';
import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { BsEmojiSmile } from 'react-icons/bs';
import { FiImage, FiLink } from 'react-icons/fi';
import { HiUserGroup } from 'react-icons/hi';
import { IoMdArrowDropdown } from 'react-icons/io';
import TiptapEditor from '../components/TiptapEditor';
import axios from 'axios';
import { toast } from 'sonner';

export default function CreateBlog() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [thumbnail, setThumbnail] = useState<string | null>(null);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [isPreview, setIsPreview] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState<string[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoadingCategories(true);
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/categories`);
                setCategories(response.data.data?.map((category: { name: string }) => category.name) || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('Failed to load categories');
            } finally {
                setIsLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

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
            // Extract the URL from the presigned URL (remove query parameters)
            return presignedUrl.split('?')[0];
        } catch (error) {
            console.error('Error uploading to S3:', error);
            toast.error('Failed to upload image');
            throw error;
        }
    };

    const createBlogPost = async (s3Key: string) => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/blog`, {
                title,
                content,
                thumbnail: s3Key,
                category: selectedCategory,
                isPublished: true,
            });
            toast.success('Blog post created successfully!');
            // Reset form or redirect
            setTitle('');
            setContent('');
            setThumbnail(null);
            setThumbnailFile(null);
            setSelectedCategory('');
        } catch (error) {
            console.error('Error creating blog post:', error);
            toast.error('Failed to create blog post');
            throw error;
        }
    };

    const handleSubmit = async () => {
        if (!title || !content || !selectedCategory) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            let s3Key = '';
            if (thumbnailFile) {
                const { presignedUrl, key } = await getPresignedUrl(thumbnailFile);
                await uploadToS3(thumbnailFile, presignedUrl);
                s3Key = key;
            }
            await createBlogPost(s3Key);
        } catch (error) {
            console.error('Error in form submission:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setThumbnailFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnail(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
        },
        multiple: false,
        maxSize: 5 * 1024 * 1024 // 5MB
    });

    return (
        <div className="max-w-4xl w-2/3 mx-auto p-6">
            {/* Header */}
            <div className="flex gap-4 mb-6 border-b pb-4">
                <button className="px-4 py-2 bg-gray-100 rounded-full font-medium text-gray-700 hover:bg-gray-200">
                    New post
                </button>
                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full">
                    Share a link
                </button>
            </div>

            {/* Category Selection */}
            <div className="mb-6 relative">
                <button
                    className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 w-56"
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    disabled={isLoadingCategories}
                >
                    <HiUserGroup className="text-gray-500" />
                    <span className="flex-1 text-left">
                        {isLoadingCategories ? 'Loading categories...' : selectedCategory || 'Select Category'}
                    </span>
                    <IoMdArrowDropdown className="text-gray-500" />
                </button>

                {showCategoryDropdown && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-lg shadow-lg z-10">
                        {categories.map((category) => (
                            <button
                                key={category}
                                className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                                onClick={() => {
                                    setSelectedCategory(category);
                                    setShowCategoryDropdown(false);
                                }}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Thumbnail Upload */}
            <div className="mb-6">
                {thumbnail ? (
                    <div className="relative h-48 w-full rounded-lg overflow-hidden group">
                        <Image
                            src={thumbnail}
                            alt="Thumbnail"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200">
                            <button
                                onClick={() => setThumbnail(null)}
                                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${isDragActive
                                ? 'border-purple-500 bg-purple-50'
                                : 'hover:bg-gray-50 border-gray-300'
                            }`}
                    >
                        <input {...getInputProps()} />
                        <div className="space-y-2">
                            <FiImage className={`mx-auto text-3xl ${isDragActive ? 'text-purple-500' : 'text-gray-400'}`} />
                            <p className={`${isDragActive ? 'text-purple-500' : 'text-gray-500'}`}>
                                {isDragActive
                                    ? "Drop your image here..."
                                    : "Drag & drop your thumbnail, or click to select"}
                            </p>
                            <p className="text-sm text-gray-400">
                                Supports: JPG, PNG, GIF (Max 5MB)
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Title Input */}
            <input
                type="text"
                placeholder="Post Title*"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xl font-medium placeholder-gray-500 mb-6 p-2 focus:outline-none rounded-md"
                maxLength={250}
            />

            {/* Content Editor */}
            <div className="min-h-[200px] mb-6">
                <div className="border rounded-lg">
                    <div className="flex border-b p-2 gap-2">
                        <button
                            className={`p-2 rounded transition-colors ${!isPreview ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
                            onClick={() => setIsPreview(false)}
                        >
                            Write
                        </button>
                        <button
                            className={`p-2 rounded transition-colors ${isPreview ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
                            onClick={() => setIsPreview(true)}
                        >
                            Preview
                        </button>
                        <div className="ml-auto">
                            <span className="text-gray-400">Saved</span>
                        </div>
                    </div>

                    <div className="min-h-[300px]">
                        {isPreview ? (
                            <div
                                className="prose max-w-none p-4 min-h-[200px] prose-img:rounded-lg prose-a:text-blue-600"
                                dangerouslySetInnerHTML={{ __html: content }}
                            />
                        ) : (
                            <TiptapEditor
                                content={content}
                                onChange={setContent}
                            />
                        )}
                    </div>

                    <div className="border-t p-3 flex items-center justify-between">
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                                <FiImage className="text-gray-500" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                                <FiLink className="text-gray-500" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                                <BsEmojiSmile className="text-gray-500" />
                            </button>
                        </div>
                        <button 
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
