"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { BsEmojiSmile } from "react-icons/bs";
import { FiImage, FiLink } from "react-icons/fi";
import { HiUserGroup } from "react-icons/hi";
import { IoMdArrowDropdown } from "react-icons/io";
import TiptapEditor from "@/components/layout/TiptapEditor";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedSquad, setSelectedSquad] = useState("");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [showSquadDropdown, setShowSquadDropdown] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const squads = ["Engineering", "Design", "Marketing", "Product", "General"];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
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
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    multiple: false,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex gap-4 mb-6 border-b pb-4">
        <button className="px-4 py-2 bg-gray-100 rounded-full font-medium text-gray-700 hover:bg-gray-200">
          New post
        </button>
        <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full">
          Share a link
        </button>
      </div>

      {/* Squad Selection */}
      <div className="mb-6 relative">
        <button
          className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 w-56"
          onClick={() => setShowSquadDropdown(!showSquadDropdown)}
        >
          <HiUserGroup className="text-gray-500" />
          <span className="flex-1 text-left">
            {selectedSquad || "Select Category"}
          </span>
          <IoMdArrowDropdown className="text-gray-500" />
        </button>

        {showSquadDropdown && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-lg shadow-lg z-10">
            {squads.map((squad) => (
              <button
                key={squad}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                onClick={() => {
                  setSelectedSquad(squad);
                  setShowSquadDropdown(false);
                }}
              >
                {squad}
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
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
              isDragActive
                ? "border-purple-500 bg-purple-50"
                : "hover:bg-gray-50 border-gray-300"
            }`}
          >
            <input {...getInputProps()} />
            <div className="space-y-2">
              <FiImage
                className={`mx-auto text-3xl ${isDragActive ? "text-purple-500" : "text-gray-400"}`}
              />
              <p
                className={`${isDragActive ? "text-purple-500" : "text-gray-500"}`}
              >
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
              className={`p-2 rounded transition-colors ${!isPreview ? "bg-gray-100" : "hover:bg-gray-100"}`}
              onClick={() => setIsPreview(false)}
            >
              Write
            </button>
            <button
              className={`p-2 rounded transition-colors ${isPreview ? "bg-gray-100" : "hover:bg-gray-100"}`}
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
              <TiptapEditor content={content} onChange={setContent} />
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
            <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
