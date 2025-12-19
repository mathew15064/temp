'use client';
import { useEffect, useState } from 'react';
import { postsApi, Post } from '@/lib/api/posts';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, LayoutDashboard, LogIn } from 'lucide-react'; // Thêm icon
import Link from 'next/link';

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // State kiểm tra admin

  useEffect(() => {
    // 1. Kiểm tra quyền Admin từ localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.is_admin) setIsAdmin(true);
    }

    // 2. Load bài viết
    const loadData = async () => {
      try {
        const res = await postsApi.list({ page: 1, limit: 6, status: 'published' });
        setPosts(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="flex h-16 w-full max-w-7xl items-center justify-between mx-auto px-4">
          <Link href="/" className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold tracking-tight">My Blog</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {isAdmin ? (
              <Link href="/dashboard/posts">
                <Button variant="default" className="gap-2 bg-blue-600 hover:bg-blue-700">
                  <LayoutDashboard className="w-4 h-4" /> Quản trị Admin
                </Button>
              </Link>
            ) : ''}
          </div>
        </div>
      </header>
      
      <main className="container mx-auto max-w-7xl px-4 py-12">
        {/* Hero Section giữ nguyên hoặc tối ưu thêm */}
        <section className="py-16 text-center">
          <h1 className="text-6xl font-black mb-4 tracking-tight text-slate-900">Blog Công nghệ</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Khám phá kiến thức lập trình, kinh nghiệm thực chiến và các xu hướng công nghệ mới nhất.
          </p>
        </section>

        <section>
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-slate-800">📝 Bài viết mới nhất</h2>
            <div className="h-px flex-1 bg-slate-200 mx-6 hidden sm:block"></div>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[1,2,3].map(i => <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {posts.map(post => (
                <Card key={post.id} className="flex flex-col overflow-hidden border-slate-200/60 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  <div className="relative h-52 w-full bg-slate-100">
                    {post.thumbnail_url ? (
                      <img src={post.thumbnail_url} alt={post.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                         <Sparkles className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  
                  <CardHeader className="flex-1">
                    <CardTitle className="line-clamp-2 text-xl leading-tight hover:text-blue-600 transition-colors cursor-pointer">
                      <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-3 text-slate-600 pt-2">
                      {post.summary}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardFooter className="border-t bg-slate-50/50 justify-between py-3">
                    <span className="text-xs font-medium text-slate-400 italic">
                      {new Date(post.created_at).toLocaleDateString('vi-VN')}
                    </span>
                    <Link href={`/posts/${post.slug}`}>
                      <Button variant="link" className="text-blue-600 p-0 font-bold hover:no-underline flex items-center group">
                        Đọc bài <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}