// front_end/components/providers/AuthProvider.tsx
'use client';

import { useEffect } from 'react';
import { redirect, usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { checkToken } from '@/lib/axios';

const publicRoutes = ['/login', '/register', '/forgot-password'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { checkAuth, isAuthenticated, isLoading, setUser } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

      // Kiểm tra token trong cookie
      const hasValidToken = await checkToken();

      if (!hasValidToken) {
        if (!isPublicRoute) {
          redirect('/login');
        }
        setUser(null);
        return;
      }

      // Lấy thông tin user
      try {
        await checkAuth();
        
        // Nếu đã authenticated và đang ở public route, redirect về dashboard
        if (isPublicRoute) {
          redirect('/dashboard');
        }
      } catch (error) {
        if (!isPublicRoute) {
          redirect('/login');
        }
      }
    };

    initAuth();
  }, [pathname]);

  // Hiển thị loading khi đang check auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}