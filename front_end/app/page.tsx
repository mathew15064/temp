import { ArrowRight, BookOpen, Menu, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// --- DỮ LIỆU MÔ PHỎNG (Sẽ được thay thế bằng API thực tế) ---
const FEATURED_POSTS = [
  { id: 1, title: "FeaturedPosts", description: "ID: Plie; 4x Ngày thấn 10, 2024", date: "4.26.2", tags: ['Backend', 'Next.js', 'Prisma'] },
  { id: 2, title: "Cảm Nang Xây dựng Backend với NestJS Prisma", description: "Tận Dụng các Khăn RESTful API; lập trình Nhúng.", date: "4.26.2", tags: ['Backend', 'NestJS', 'Prisma'] },
  { id: 3, title: "Thiết kế Giao diện đẹp mắt và shadcn/ui", description: "Sử dụng Tailwind và shadcn/ui.", date: "4.26.8", tags: ['Frontend', 'Tailwind', 'shadcn/ui'] },
];

const GENERAL_POSTS = [
  { id: 4, title: "FeaturedPosts", description: "ID: Plie; 4x Ngày thấn 10, 2024", date: "4.26.2", tags: ['Backend', 'Next.js', 'Prisma'] },
  { id: 5, title: "Cảm Nang Xây dựng Backend với NestJS Prisma", description: "Tận Dụng các Khăn RESTful API; lập trình Nhúng.", date: "4.26.2", tags: ['Backend', 'NestJS', 'Prisma'] },
  { id: 6, title: "Thiết kế Giao diện đẹp mắt và shadcn/ui", description: "Sử dụng Tailwind và shadcn/ui.", date: "4.26.8", tags: ['Frontend', 'Tailwind', 'shadcn/ui'] },
];

const TAG_COLORS: { [key: string]: string } = {
  'Backend': 'bg-red-500',
  'Frontend': 'bg-blue-500',
  'Next.js': 'bg-gray-700',
  'Prisma': 'bg-green-600',
  'NestJS': 'bg-orange-600',
  'Tailwind': 'bg-sky-500',
  'shadcn/ui': 'bg-purple-500',
};

// --- COMPONENT THẺ BÀI VIẾT ---
const PostCard = ({ post }: { post: typeof FEATURED_POSTS[0] }) => (
  <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
    <div className="relative h-48 bg-gray-200 dark:bg-gray-800">
      {/* Ảnh mô phỏng */}
      <div className="absolute top-2 right-2 flex items-center gap-1 text-sm text-white bg-black/50 p-1 rounded-sm">
        <BookOpen className="w-3 h-3" />
        {post.date}
      </div>
      <div className="absolute bottom-0 left-0 p-3 bg-gradient-to-t from-black/60 to-transparent w-full">
        <div className="flex flex-wrap gap-1">
          {post.tags.map(tag => (
            <span key={tag} className={`px-2 py-0.5 text-xs font-semibold rounded-full text-white ${TAG_COLORS[tag] || 'bg-gray-500'}`}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
    <CardHeader>
      <CardTitle className="text-xl font-bold">{post.title}</CardTitle>
      <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
        {post.description}
      </CardDescription>
    </CardHeader>
    <CardFooter className="justify-between">
      <div className="text-xs text-gray-500">
        {post.date} | {post.description.split(';').pop()?.trim()}
      </div>
      <Button variant="ghost" className="text-blue-600 dark:text-blue-400 p-0 h-auto">
        Đọc thêm <ArrowRight className="w-4 h-4 ml-1" />
      </Button>
    </CardFooter>
  </Card>
);

// --- COMPONENT HEADER VÀ NAVIGATION ---
// --- COMPONENT HEADER VÀ NAVIGATION (Đã Chỉnh Sửa) ---
const Header = () => (
  <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm dark:bg-black/95">
    {/* Sửa đổi:
      1. Thay thế "container" bằng "mx-auto" để kiểm soát căn giữa.
      2. Tăng giới hạn chiều rộng tối đa (max-w-7xl -> max-w-screen-2xl) 
         để nội dung gần như chiếm hết màn hình rộng hơn.
      3. Đảm bảo padding ngang nhất quán.
    */}
    <div className="flex h-16 w-full max-w-screen-2xl items-center justify-between mx-auto px-4 sm:px-8 lg:px-12"> 
      {/* Logo và Menu chính */}
      <div className="flex items-center space-x-6">
        <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        <span className="text-xl font-bold tracking-tight">My CMS Blog</span>
        
        {/* Navigation - Ẩn trên di động */}
        <nav className="hidden space-x-4 sm:flex">
          <a href="#" className="text-sm font-medium hover:text-blue-600 transition-colors">Trang Chủ</a>
          <a href="#" className="text-sm font-medium hover:text-blue-600 transition-colors">Danh Mục</a>
          <a href="#" className="text-sm font-medium hover:text-blue-600 transition-colors">Về Chúng Tôi</a>
          <a href="#" className="text-sm font-medium hover:text-blue-600 transition-colors">Liên Hệ</a>
        </nav>
      </div>

      {/* Button và Mobile Menu */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" className="hidden sm:inline-flex">Đăng Nhập</Button>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white hidden sm:inline-flex">Đăng Ký</Button>
        
        {/* Mobile Menu Icon */}
        <Button variant="ghost" size="icon" className="sm:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </div>
  </header>
);

// --- TRANG CHỦ ---
export default function HomePage() {
  return (
    <>
      <Header />
      
      <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Khu vực Hero/Chào mừng */}
        <section className="py-20 text-center sm:text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-4 text-gray-900 dark:text-white">
            Chào mừng đến với Blog Công nghệ
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto sm:mx-0">
            Nơi chia sẻ kiến thức chuyên sâu và những phân tích sắc bén về công nghệ, AI và lập trình.
          </p>
        </section>

        <Separator className="my-10" />

        {/* Khu vực Bài viết Nổi bật */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
            ⭐ Bài viết Nổi bật
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURED_POSTS.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
        
        <Separator className="my-10" />
        
        {/* Khu vực Bài viết mới nhất */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
            📝 Bài viết Mới nhất
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {GENERAL_POSTS.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      </main>
      
      <footer className="mt-20 border-t py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} My CMS Blog. All rights reserved.
      </footer>
    </>
  );
}