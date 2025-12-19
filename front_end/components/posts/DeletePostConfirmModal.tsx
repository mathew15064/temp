'use client';

import { Post } from '@/lib/api/posts';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, FileX } from "lucide-react";

export default function DeletePostConfirmModal({ post, onClose, onConfirm }: any) {
  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-[400px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-destructive/10 rounded-full text-destructive">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <AlertDialogTitle className="text-xl font-bold">Xóa bài viết?</AlertDialogTitle>
          </div>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Dữ liệu bài viết sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
              </p>
              <div className="bg-muted/50 p-3 rounded-lg border border-dashed text-sm flex gap-3 items-center">
                 {post.thumbnail_url && <img src={post.thumbnail_url} className="w-12 h-12 rounded object-cover border" />}
                 <div className="flex-1 overflow-hidden">
                    <p className="font-semibold truncate">{post.title}</p>
                    <p className="text-[10px] uppercase text-muted-foreground tracking-widest italic">ID: #{post.id}</p>
                 </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel onClick={onClose} className="flex-1 mt-0">Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="flex-1 bg-destructive hover:bg-destructive/90">Xóa bài</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}