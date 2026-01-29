import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { WishlistEntry } from '@/types/domain';

import { addToWishlist, fetchWishlist, removeFromWishlist } from './api';

export const useWishlist = () =>
  useQuery<WishlistEntry[]>({
    queryKey: ['wishlist'],
    queryFn: fetchWishlist
  });

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addToWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    }
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeFromWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    }
  });
};
