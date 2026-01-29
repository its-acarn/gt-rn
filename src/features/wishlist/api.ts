import { api } from '@/api/client';
import { WishlistEntry } from '@/types/domain';

export const fetchWishlist = async () => {
  const response = await api.get<WishlistEntry[]>('/api/me/wishlist');
  return response.data;
};

export const addToWishlist = async (courseId: string) => {
  const response = await api.post<WishlistEntry>('/api/wishlist', { courseId });
  return response.data;
};

export const removeFromWishlist = async (courseId: string) => {
  await api.delete(`/api/wishlist/${courseId}`);
  return courseId;
};
