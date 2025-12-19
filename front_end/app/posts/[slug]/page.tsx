import { postsApi } from '@/lib/api/posts';
import { Calendar, ArrowLeft, Sparkles, Clock, Share2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- IMPORT SYNTAX HIGHLIGHTER ---
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostDetailPage({ params }: PageProps) {
  const { slug } = await params;

  try {
    const post = await postsApi.getBySlug(slug);

    if (!post) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-3xl font-bold text-slate-900">404</h2>
          <p className="text-slate-500">Bài viết này không tồn tại.</p>
          <Link href="/" className="mt-6">
            <Button>Quay lại trang chủ</Button>
          </Link>
        </div>
      );
    }

    const wordCount = post.content.replace(/[#*`~[\]]/g, '').split(/\s+/g).length;
    const readingTime = Math.ceil(wordCount / 200);

    return (
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
          <div className="flex h-16 w-full max-w-7xl items-center justify-between mx-auto px-4">
            <Link href="/" className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold tracking-tight text-slate-900">My Blog</span>
            </Link>
            <div className="hidden sm:block text-sm font-medium text-slate-500 truncate max-w-[300px]">
              {post.title}
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 pt-10 pb-24">
          <nav className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="group gap-2 -ml-4 text-slate-500 hover:text-blue-600">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Quay lại trang chủ
              </Button>
            </Link>
          </nav>

          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-4 text-sm text-blue-600 font-semibold mb-4 uppercase tracking-wider">
              <span>Công nghệ</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <div className="flex items-center gap-1.5 text-slate-500 font-normal normal-case">
                <Clock className="w-4 h-4" /> {readingTime} phút đọc
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-tight tracking-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-inner">
                  {post.author?.name?.charAt(0) || "A"}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{post.author?.name || "Admin"}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.created_at).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
            </div>
          </header>

          {post.thumbnail_url && (
            <div className="mb-16 overflow-hidden rounded-3xl border shadow-2xl">
              <img src={post.thumbnail_url} className="w-full aspect-video object-cover" alt="" />
            </div>
          )}

          {/* --- NỘI DUNG RENDER MARKDOWN --- */}
          <article className="prose prose-slate prose-lg max-w-none 
            prose-headings:text-slate-900 prose-headings:font-black 
            prose-p:text-slate-700 prose-p:leading-relaxed
            prose-strong:text-slate-900 prose-strong:font-bold
            prose-img:rounded-2xl prose-img:shadow-xl
            prose-pre:bg-transparent prose-pre:p-0
            dark:prose-invert">
            
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Tùy biến hiển thị Code Block
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <div className="rounded-xl overflow-hidden my-6 shadow-2xl border border-slate-800">
                      <div className="bg-slate-800 px-4 py-2 text-xs text-slate-400 flex justify-between items-center border-b border-slate-700">
                        <span>{match[1].toUpperCase()}</span>
                      </div>
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{ margin: 0, padding: '1.5rem', fontSize: '0.9rem' }}
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-mono text-sm" {...props}>
                      {children}
                    </code>
                  );
                },
                // Tùy biến hiển thị Table để có viền đẹp
                table: ({ children }) => (
                  <div className="overflow-x-auto my-8 border rounded-xl shadow-sm">
                    <table className="w-full border-collapse">{children}</table>
                  </div>
                ),
                thead: ({ children }) => <thead className="bg-slate-50 border-b">{children}</thead>,
                th: ({ children }) => <th className="p-3 text-left font-bold text-slate-900">{children}</th>,
                td: ({ children }) => <td className="p-3 border-t border-slate-100">{children}</td>,
              }}
            >
              {post.content}
            </ReactMarkdown>
          </article>

          <footer className="mt-16 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-400 text-sm mb-6 italic">Hết bài viết.</p>
            <div className="flex justify-center gap-4">
               <Button variant="outline" className="rounded-full px-6 hover:bg-blue-50 hover:text-blue-600 transition-colors">👍 Hữu ích</Button>
               <Button variant="outline" className="rounded-full px-6">🔗 Chia sẻ</Button>
            </div>
          </footer>
        </main>
      </div>
    );
  } catch (error) {
    return (
      <div className="text-center py-24">
        <h2 className="text-xl font-bold text-red-500">Lỗi hệ thống</h2>
        <Link href="/" className="mt-6 inline-block underline text-slate-500">Quay về trang chủ</Link>
      </div>
    );
  }
}