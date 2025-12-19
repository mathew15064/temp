'use client';

import { useState } from 'react';
import { usersApi, User, UserCreateInput, UserUpdateInput } from '@/lib/api/users';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, User as UserIcon, Mail, Lock } from "lucide-react";

interface UserFormModalProps {
  mode: 'create' | 'edit';
  user?: User;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UserFormModal({ mode, user, onClose, onSuccess }: UserFormModalProps) {
  const [formData, setFormData] = useState({
    email: user?.email || '',
    name: user?.name || '',
    password: '',
    is_admin: user?.is_admin || false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'create') {
        if (!formData.password) {
          setError('Mật khẩu là bắt buộc khi tạo tài khoản');
          setLoading(false);
          return;
        }
        await usersApi.create(formData as UserCreateInput);
      } else if (user) {
        const updateData: UserUpdateInput = {
          email: formData.email !== user.email ? formData.email : undefined,
          name: formData.name !== user.name ? formData.name : undefined,
          is_admin: formData.is_admin !== user.is_admin ? formData.is_admin : undefined,
        };
        
        if (formData.password) {
          updateData.password = formData.password;
        }

        await usersApi.update(user.id, updateData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <UserIcon className="w-5 h-5" />
            {mode === 'create' ? 'Thêm thành viên' : 'Sửa thành viên'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          {error && (
            <Alert variant="destructive" className="py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Địa chỉ Email <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Họ và tên <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder="Nguyễn Văn A"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" d-slot="label" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex justify-between">
              <span>Mật khẩu {mode === 'create' && <span className="text-destructive">*</span>}</span>
              {mode === 'edit' && <span className="text-[10px] lowercase font-normal italic">Để trống nếu không đổi</span>}
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-9"
                required={mode === 'create'}
                minLength={6}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="is_admin" 
              checked={formData.is_admin} 
              onCheckedChange={(checked) => setFormData({ ...formData, is_admin: checked === true })}
            />
            <Label 
              htmlFor="is_admin" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Cấp quyền Quản trị viên (Admin)
            </Label>
          </div>

          <DialogFooter className="pt-4 gap-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading} className="flex-1">
              Hủy
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 shadow-md">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý
                </>
              ) : (
                mode === 'create' ? 'Tạo tài khoản' : 'Lưu thay đổi'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}