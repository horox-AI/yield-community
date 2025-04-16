export const metadata = {
  title: 'Categories - Community',
  description: 'Browse posts by category',
}

import Boxes from '@/components/boxes'
import Sidebar from '@/components/sidebar'
import RightBar from '@/components/rightbar'
import CategoryFilteredPosts from '@/components/category-filtered-posts'

export default function CategoriesPage() {
  return (
    <>
      {/* Page content */}
      <section>
        <div className="max-w-9xl mx-auto px-4 sm:px-6 pt-16 md:pt-20 lg:pt-16">
              
          <div className="md:flex md:justify-between md:divide-x md:divide-slate-800">

            <RightBar />
            {/* Main content */}
            <div className="md:grow pt-6 pb-12 md:pb-20">
              <div>
                <CategoryFilteredPosts />          
                <Boxes />
              </div>
            </div>

            <Sidebar />

          </div>
        </div>
      </section> 
    </>
  )
} 