'use client';

import { useState, useEffect } from 'react';
import { postsApi, Post } from '@/lib/api/posts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Trash2, 
  Edit3, 
  Plus, 
  Search, 
  MoreVertical,
  ImageIcon,
  Calendar,
  Eye,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Input } from '@/components/ui/input';
import PostFormModal from '@/components/posts/PostFormModal'
import DeletePostConfirmModal from '@/components/posts/DeletePostConfirmModal';

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await postsApi.list({ page: 1, limit: 100 });
      setPosts(res.data);
    } finally {
      setLoading(false);
    }
  };
    

  useEffect(() => { fetchPosts(); }, []);

  // Logic Phân trang & Tìm kiếm
  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + itemsPerPage);
	const handleEdit = (post: Post) => {
		setSelectedPost(post);
		setShowFormModal(true);
	};

	const handleDeleteClick = (post: Post) => {
		setSelectedPost(post);
		setShowDeleteModal(true);
	};
  const handleViewOnSite = (slug: string) => {
    // Mở trang chi tiết bài viết ở tab mới
    window.open(`/posts/${slug}`, '_blank');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Quản lý bài viết</h1>
          <p className="text-slate-500 mt-1">Tạo, chỉnh sửa và quản lý các nội dung trên Blog của bạn.</p>
        </div>
        <Button onClick={() => { setSelectedPost(null); setShowFormModal(true); }} className="gap-2 shadow-lg bg-blue-600 hover:bg-blue-700 transition-all">
          <Plus className="w-4 h-4" /> Viết bài mới
        </Button>
      </div>

      {/* Table & Pagination Container */}
      <Card className="shadow-xl border-slate-200 overflow-hidden bg-white">
        <div className="p-4 border-b bg-slate-50/50 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              className="pl-9 bg-white shadow-sm" 
              placeholder="Tìm kiếm bài viết..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <Badge variant="outline" className="bg-white px-3 py-1 text-slate-600 border-slate-300">
            {filteredPosts.length} kết quả
          </Badge>
        </div>

        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[80px] font-bold text-slate-700">Ảnh</TableHead>
              <TableHead className="min-w-[350px] font-bold text-slate-700">Nội dung</TableHead>
              <TableHead className="font-bold text-slate-700 text-center">Trạng thái</TableHead>
              <TableHead className="font-bold text-slate-700">Ngày đăng</TableHead>
              <TableHead className="text-right font-bold text-slate-700">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-20 text-slate-400">Đang tải dữ liệu...</TableCell></TableRow>
            ) : paginatedPosts.length > 0 ? (
              paginatedPosts.map((post) => (
                <TableRow key={post.id} className="hover:bg-blue-50/30 transition-colors group">
                  <TableCell>
                    {post.thumbnail_url ? (
                      <img src={post.thumbnail_url} className="w-14 h-10 rounded-lg object-cover border shadow-sm" alt="" />
                    ) : (
                      <div className="w-14 h-10 bg-slate-100 rounded-lg flex items-center justify-center border-dashed border-2 text-slate-300">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{post.title}</span>
                      <span className="text-xs text-slate-500 line-clamp-1 mt-0.5 italic">{post.slug}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={
                      post.status === 'published' 
                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200' 
                      : 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200'
                    }>
                      {post.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(post.created_at).toLocaleDateString('vi-VN')}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-200">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52 shadow-xl border-slate-200">
                        <DropdownMenuLabel className="text-slate-400 font-normal text-xs uppercase tracking-wider">Tùy chọn</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEdit(post)} className="cursor-pointer gap-2">
                          <Edit3 className="h-4 w-4 text-blue-500" /> <b>Chỉnh sửa bài viết</b>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewOnSite(post.slug)} className="cursor-pointer gap-2">
                          <Eye className="h-4 w-4 text-emerald-500" /> <b>Xem trên trang chủ</b>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteClick(post)} className="cursor-pointer gap-2 text-red-600 focus:bg-red-50 focus:text-red-600">
                          <Trash2 className="h-4 w-4" /> <b>Xóa bài viết</b>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={5} className="text-center py-20 text-slate-400 font-medium">Không tìm thấy kết quả nào cho "{searchTerm}"</TableCell></TableRow>
            )}
          </TableBody>
        </Table>

        {/* --- PHẦN PAGINATION --- */}
        <div className="p-4 border-t bg-slate-50/50 flex items-center justify-between">
          <div className="text-sm text-slate-500">
            Hiển thị <b>{startIndex + 1}</b> - <b>{Math.min(startIndex + itemsPerPage, filteredPosts.length)}</b> trên tổng số <b>{filteredPosts.length}</b> bài viết
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="bg-white"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Trước
            </Button>
            

            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="bg-white"
            >
              Sau <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Modals */}
      {showFormModal && (
        <PostFormModal 
          post={selectedPost} 
          onClose={() => setShowFormModal(false)} 
          onSuccess={() => { setShowFormModal(false); fetchPosts(); }} 
        />
      )}

      {showDeleteModal && selectedPost && (
        <DeletePostConfirmModal 
          post={selectedPost}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={async () => {
            await postsApi.delete(selectedPost.id);
            setShowDeleteModal(false);
            fetchPosts();
          }}
        />
      )}
    </div>
  );
}