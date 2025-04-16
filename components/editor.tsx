'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
// Import Quill CSS properly with Next.js client-side only
import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <p>Loading editor...</p>
});

// Import the Dropzone component for file uploads
import { useDropzone } from 'react-dropzone';

// Define categories and popular tags
const CATEGORIES = [
  '🏠 Real Estate Investing',
  '📈 Market Trends',
  '🛠️ Property Renovation',
  '💰 Financing & Loans',
  '📊 Tax & Legal',
];

const POPULAR_TAGS = [
  'rental yield', 'investment', 'market analysis', 'house flipping', 'renovation',
  'passive income', 'REIT', 'real estate market', 'first-time investor',
  'property management', 'commercial real estate', 'residential', 'mortgage',
  'down payment', 'cash flow', 'appreciation', 'rental property'
];

// Add custom styles for the editor
const customEditorStyles = {
  editor: {
    color: '#000000',
    backgroundColor: '#ffffff',
    minHeight: '200px',
    padding: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
  }
};

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['blockquote', 'link'],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'blockquote', 'link'
];

export default function Editor() {
  const { data: session } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [status, setStatus] = useState('published');
  const [isUploading, setIsUploading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  
  const tagInputRef = useRef<HTMLInputElement>(null);

  // Effect for tag suggestions
  useEffect(() => {
    if (tagInput) {
      const filtered = POPULAR_TAGS.filter(tag => 
        tag.toLowerCase().includes(tagInput.toLowerCase()) && 
        !tags.includes(tag)
      ).slice(0, 5);
      setSuggestedTags(filtered);
    } else {
      setSuggestedTags([]);
    }
  }, [tagInput, tags]);

  // Handle image uploads
  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/posts/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload image');
      }

      const data = await response.json();
      setImages(prev => [...prev, data.imageUrl]);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 1,
  });

  // Handle tag input
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput) {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setTagInput('');
      setSuggestedTags([]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const removeImage = (imageUrl: string) => {
    setImages(images.filter(img => img !== imageUrl));
  };

  // Validate form
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!title) newErrors.title = 'Title is required';
    else if (title.length > 100) newErrors.title = 'Title cannot be longer than 100 characters';
    
    if (!content) newErrors.content = 'Content is required';
    else if (content.replace(/<[^>]*>/g, '').length < 50) newErrors.content = 'Content must be at least 50 characters long';
    
    if (!category) newErrors.category = 'Category is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent, saveAsDraft = false) => {
    e.preventDefault();
    
    if (!session?.user) {
      alert('You must be signed in to create a post');
      return;
    }

    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      const postStatus = saveAsDraft ? 'draft' : 'published';
      
      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          category,
          tags,
          images,
          status: postStatus,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create post');
      }

      const data = await response.json();
      
      // Redirect to the appropriate page
      if (data.redirect) {
        router.push(data.redirect);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (previewMode) {
    return (
      <div className="bg-white dark:bg-header-bg rounded-lg shadow-sm p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Preview</h1>
          <button
            onClick={() => setPreviewMode(false)}
            className="px-4 py-2 text-sm bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Back to Editor
          </button>
        </div>
        
        <div className="preview-container">
          <h1 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">{title}</h1>
          
          {images.length > 0 && (
            <div className="mb-6">
              <Image 
                src={images[0]} 
                alt="Post image" 
                width={800} 
                height={400} 
                className="rounded-lg object-cover w-full max-h-96" 
              />
            </div>
          )}
          
          <div className="mb-4 flex space-x-2">
            <span className="text-indigo-600 dark:text-indigo-400 font-medium">{category}</span>
          </div>
          
          <div className="prose prose-slate dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
          
          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
      {/* Title Input */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          placeholder="Enter a descriptive title (100 characters max)"
          className={`mt-1 bg-white dark:bg-slate-800 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 ${
            errors.title ? 'border-red-500' : ''
          }`}
          required
        />
        <div className="flex justify-between mt-1">
          {errors.title ? (
            <p className="text-red-500 text-sm">{errors.title}</p>
          ) : (
            <p className="text-slate-500 dark:text-slate-400 text-sm invisible">Error placeholder</p>
          )}
          <p className="text-slate-500 dark:text-slate-400 text-sm">{title.length}/100</p>
        </div>
      </div>

      {/* Category Selection */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 bg-white dark:bg-slate-800 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
          required
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
      </div>

      {/* Tags Input */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Tags <span className="text-slate-500 dark:text-slate-400 text-sm">(up to 5)</span>
        </label>
        <div className="relative">
          <input
            ref={tagInputRef}
            type="text"
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            placeholder="Add tags and press Enter"
            className="mt-1 bg-white dark:bg-slate-800 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
            disabled={tags.length >= 5}
          />
          
          {/* Tag suggestions */}
          {suggestedTags.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-lg">
              {suggestedTags.map((tag) => (
                <div
                  key={tag}
                  className="px-4 py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                  onClick={() => addTag(tag)}
                >
                  {tag}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span 
                key={tag} 
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1.5 text-indigo-500 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          {tags.length}/5 tags used
        </p>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Images <span className="text-slate-500 dark:text-slate-400 text-sm">(JPEG, PNG, max 5MB)</span>
        </label>
        <div
          {...getRootProps()}
          className={`mt-1 border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${
            isDragActive
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
              : 'border-slate-300 dark:border-slate-600'
          }`}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <div className="text-slate-500 dark:text-slate-400">
              <svg className="animate-spin h-5 w-5 mr-3 inline-block text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </div>
          ) : isDragActive ? (
            <p className="text-indigo-500">Drop your image here</p>
          ) : (
            <div className="text-slate-500 dark:text-slate-400">
              <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-1">
                Drag and drop an image, or <span className="text-indigo-500">click to select</span>
              </p>
            </div>
          )}
        </div>
        
        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((imageUrl) => (
              <div key={imageUrl} className="relative group rounded-md overflow-hidden">
                <Image
                  src={imageUrl}
                  alt="Uploaded image"
                  width={200}
                  height={150}
                  className="w-full h-32 object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(imageUrl)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Content (Rich Text Editor) */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Content <span className="text-red-500">*</span> <span className="text-slate-500 dark:text-slate-400 text-sm">(minimum 50 characters)</span>
        </label>
        <div className={`mt-1 ${errors.content ? 'border-red-500 rounded-md' : ''}`}>
          <style jsx global>{`
            .quill {
              background-color: white;
              border-radius: 0.375rem;
              border: 1px solid #d1d5db;
            }
            .quill .ql-editor {
              min-height: 200px;
              color: #000000 !important;
              font-size: 1rem;
            }
            .quill .ql-toolbar {
              border-bottom: 1px solid #d1d5db;
              background-color: #f9fafb;
              border-top-left-radius: 0.375rem;
              border-top-right-radius: 0.375rem;
            }
            .quill .ql-container {
              border-bottom-left-radius: 0.375rem;
              border-bottom-right-radius: 0.375rem;
            }
            .dark .quill {
              border-color: #4b5563;
            }
            .dark .quill .ql-toolbar {
              background-color: #374151;
              border-color: #4b5563;
            }
            .dark .quill .ql-editor {
              background-color: #1f2937;
              color: #f3f4f6 !important;
            }
          `}</style>
          <ReactQuill
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            placeholder="Write your post content here..."
            theme="snow"
          />
        </div>
        {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
      </div>

      {/* Buttons */}
      <div className="flex justify-between pt-4">
        <div>
          <button
            type="button"
            onClick={() => setPreviewMode(true)}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors mr-4"
          >
            Preview
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isSubmitting}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Save as Draft
          </button>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Publishing...' : 'Publish Post'}
        </button>
      </div>
    </form>
  );
}