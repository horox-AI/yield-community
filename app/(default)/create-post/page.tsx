import Editor from '@/components/editor';

export default function CreatePostPage() {
  return (
    <div className="container mt-20  mx-auto py-8 max-w-6xl mx-auto px-4 sm:px-6 pt-16 md:pt-20 lg:pt-16">
      <h1 className="text-2xl font-bold mb-4">Create a New Post</h1>
      <Editor />
    </div>
  );
}