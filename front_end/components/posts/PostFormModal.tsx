'use client';

import { useState } from 'react';
import { postsApi, Post } from '@/lib/api/posts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertCircle, 
  Loader2, 
  FileText, 
  ImageIcon, 
  Type, 
  AlignLeft,
  UploadCloud,
  X,
  Eye
} from "lucide-react";

// --- IMPORT EDITOR ---
import MDEditor from '@uiw/react-md-editor';

interface PostFormModalProps {
  post?: Post | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PostFormModal({ post, onClose, onSuccess }: PostFormModalProps) {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    summary: post?.summary || '',
    content: post?.content || '',
    thumbnail_url: post?.thumbnail_url || '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(post?.thumbnail_url || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const mode = post ? 'edit' : 'create';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content) {
        setError('Nội dung bài viết không được để trống');
        return;
    }
    setError('');
    setLoading(true);

    try {
      let finalThumbnailUrl = formData.thumbnail_url;

      if (file) {
        const serverUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
        const path = await postsApi.uploadImage(file);
        finalThumbnailUrl = `${serverUrl}${path}`;
      }

      if (mode === 'create') {
        await postsApi.create({ 
          ...formData, 
          thumbnail_url: finalThumbnailUrl, 
          status: 'published' 
        });
      } else if (post) {
        await postsApi.update(post.id, { 
          ...formData, 
          thumbnail_url: finalThumbnailUrl 
        });
      }
      onSuccess();
    } catch (err: any) {
      setError('Lỗi khi lưu bài viết. Vui lòng kiểm tra lại dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[95vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            {mode === 'create' ? 'Viết bài mới' : 'Chỉnh sửa nội dung'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
               {/* Tiêu đề */}
                <div className="space-y-2">
                    <Label htmlFor="title" className="text-xs font-bold uppercase text-slate-500 tracking-wider">Tiêu đề</Label>
                    <div className="relative">
                    <Type className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        id="title"
                        placeholder="Nhập tiêu đề bài viết..."
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="pl-9 h-11 border-slate-200"
                        required
                    />
                    </div>
                </div>

                {/* Tóm tắt */}
                <div className="space-y-2">
                    <Label htmlFor="summary" className="text-xs font-bold uppercase text-slate-500 tracking-wider">Mô tả ngắn</Label>
                    <div className="relative">
                    <AlignLeft className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        id="summary"
                        placeholder="Tóm tắt ngắn gọn để thu hút người đọc..."
                        value={formData.summary}
                        onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                        className="pl-9 h-11 border-slate-200"
                    />
                    </div>
                </div>
            </div>

            {/* Upload Ảnh */}
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Ảnh bìa bài viết</Label>
                <div className="flex flex-col gap-3">
                    <label className="relative h-[106px] border-2 border-dashed rounded-xl flex items-center justify-center bg-slate-50 hover:bg-slate-100 border-slate-200 transition-all cursor-pointer group overflow-hidden">
                        {preview ? (
                            <>
                                <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <UploadCloud className="w-6 h-6 text-white" />
                                </div>
                            </>
                        ) : (
                            <div className="text-center">
                                <ImageIcon className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                                <p className="text-[10px] text-slate-400 font-medium">Click để chọn ảnh</p>
                            </div>
                        )}
                        <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                    </label>
                    {preview && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => {setPreview(null); setFile(null); setFormData({...formData, thumbnail_url: ''})}} className="text-red-500 hover:text-red-600 h-7 text-xs">
                            <X className="w-3 h-3 mr-1" /> Gỡ bỏ ảnh
                        </Button>
                    )}
                </div>
            </div>
          </div>

          {/* NỘI DUNG VỚI MARKDOWN EDITOR */}
          <div className="space-y-2" data-color-mode="light">
            <div className="flex items-center justify-between">
                <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Nội dung (Markdown)</Label>
                <div className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Chế độ Preview đã bật
                </div>
            </div>
            
            <div className="min-h-[400px] border rounded-xl overflow-hidden shadow-sm">
                <MDEditor
                    value={formData.content}
                    onChange={(val) => setFormData({ ...formData, content: val || '' })}
                    preview="live" // Hiển thị song song cả code và preview
                    height={400}
                    className="border-none"
                />
            </div>
          </div>
        </form>

        <DialogFooter className="p-6 border-t bg-slate-50/50 gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="px-8 border-slate-200">
            Đóng
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={loading} className="px-8 bg-blue-600 hover:bg-blue-700 shadow-md">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Lưu & Đăng bài'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}