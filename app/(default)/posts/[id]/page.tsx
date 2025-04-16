import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Sidebar from '@/components/sidebar'
import Comments from './comments'
import UpvoteButton from '@/components/upVoteButton'
import getPosts from '@/lib/getPosts'

export async function generateStaticParams() {
  const posts = await getPosts.getPosts()
  return posts.map(post => ({
    id: post.id.toString(),
  }))
}

export async function generateMetadata({ params }: {
  params: { id: string }
}): Promise<Metadata> {
  const post = await getPosts.getPostById(params.id)
  if (!post) return { title: 'Post Not Found' }
  return { title: post.title, description: 'Page description' }
}

type PostType = Awaited<ReturnType<typeof getPosts.getPostById>> & { userVoted: boolean };

export default async function SinglePost({ params }: {
  params: { id: string }
}) {
  console.log('Fetching post with ID:', params.id);
  const post = await getPosts.getPostById(params.id) as PostType;
  console.log('Fetched post:', post);

  if (!post) {
    console.log('Post not found, triggering 404');
    notFound()
  }

  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-28 md:pt-36">
          <div className="md:flex md:justify-between md:divide-x md:divide-slate-800">
            {/* Page content*/}
            <div className="md:grow pt-6 pb-12 md:pb-20">
              <div className="md:pr-6 lg:pr-20">
                <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
                  {/* Upvotes button */}
                  <div className="shrink-0">
                    <UpvoteButton
                      id={post.id.toString()}
                      initialVotes={post.votes}
                      initialUserVoted={post.userVoted}
                      className="sticky top-6 flex flex-col items-center text-center w-14 h-14 px-1 py-3 rounded border border-slate-700 bg-gradient-to-tr from-slate-800/20 via-slate-800/50 to-slate-800/20 hover:bg-slate-800 transition duration-150 ease-in-out"
                      svgClassName="inline-flex fill-indigo-400 mb-1"
                      textClassName="text-xs font-medium text-indigo-500"
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <article className="mb-10">
                      {/* Post header */}
                      <header className="mb-6">
                        <h1 className="h2 font-aspekta text-slate-200 mb-4">{post.title}</h1>
                        <div className="flex items-center">
                          <img className="rounded-full mr-2" src={post.authorImage} width="20" height="20" alt={post.author} />
                          <div className="text-sm text-slate-600">
                            <a className="font-medium text-indigo-500 hover:text-indigo-400 transition duration-150 ease-in-out" href="#0">
                              {post.author}
                            </a>{' '}
                            · <span className="text-slate-500">{post.date}</span> · <span className="text-slate-500">{post.comments} Comment{post.comments === 1 ? '' : 's'}</span>
                          </div>
                        </div>
                      </header>

                      {/* Post content */}
                      <div className="text-lg/loose font-medium text-slate-400 space-y-6">
                        {post.content}
                      </div>
                    </article>

               
                    {/* Comments list */}
                    <Comments />
                  </div>
                </div>
              </div>
            </div>

            

          </div>
        </div>
      </div>
    </section>
  )
}