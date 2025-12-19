'use client';

import { User } from '@/lib/api/users';
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
import { AlertTriangle, UserX } from "lucide-react";

interface DeleteConfirmModalProps {
  user: User;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({ user, onClose, onConfirm }: DeleteConfirmModalProps) {
  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-[400px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-destructive/10 rounded-full">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <AlertDialogTitle className="text-xl font-bold">
              Xác nhận xóa
            </AlertDialogTitle>
          </div>
          
          {/* SỬA TẠI ĐÂY: Thêm asChild để AlertDialogDescription render ra thẻ div */}
          <AlertDialogDescription asChild className="space-y-4 pt-2">
            <div> 
              <p className="text-sm text-muted-foreground">
                Hành động này <span className="font-bold text-destructive">không thể hoàn tác</span>. 
                Tài khoản này sẽ bị xóa vĩnh viễn khỏi hệ thống.
              </p>
              
              <div className="bg-muted/50 p-4 rounded-lg border border-border space-y-2 mt-4">
                <div className="flex items-center gap-2">
                  <UserX className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Thông tin User</span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-sm">
                  <span className="text-muted-foreground">Họ tên:</span>
                  <span className="col-span-2 font-medium text-foreground">{user.name || "N/A"}</span>
                  
                  <span className="text-muted-foreground">Email:</span>
                  <span className="col-span-2 font-medium text-foreground truncate">{user.email}</span>
                  
                  <span className="text-muted-foreground">Vai trò:</span>
                  <span className="col-span-2">
                    {user.is_admin ? (
                      <span className="text-purple-600 font-medium">Quản trị viên</span>
                    ) : (
                      <span className="text-foreground font-medium">Thành viên</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 gap-2">
          <AlertDialogCancel onClick={onClose} className="flex-1 mt-0">
            Hủy bỏ
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className="flex-1 bg-destructive hover:bg-destructive/90 shadow-sm shadow-destructive/20"
          >
            Xác nhận xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}