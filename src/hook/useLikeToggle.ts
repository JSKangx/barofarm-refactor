import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductDetailType, ProductType } from "type/product";
import { useUserStore } from "store/userStore";
import { usePathname } from "next/navigation";
import useRequireAuth from "utils/requireAuth";
import { addBookmark, removeBookmark } from "server-action";

export const useLikeToggle = (product: ProductType | ProductDetailType) => {
  const [isLiked, setIsLiked] = useState(!!product?.myBookmarkId);
  const queryClient = useQueryClient();
  const { user } = useUserStore(); // 유저 정보 가져오기
  const requireAuth = useRequireAuth();
  const pathname = usePathname();

  useEffect(() => {
    setIsLiked(!!product?.myBookmarkId);
  }, [product]);

  // 북마크 추가
  const { mutate: addLike } = useMutation({
    mutationFn: async () => {
      if (!user) {
        requireAuth(pathname);
        return;
      }
      if (!product) return;
      const productId = product._id;
      addBookmark(productId);
    },
    onSuccess: () => {
      setIsLiked(true);
      queryClient.invalidateQueries({
        queryKey: ["products", product.extra.category],
      });
      // 전체 products 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
    onError: (error) => {
      console.error("찜 추가 실패: ", error);
    },
  });

  const { mutate: removeLike } = useMutation({
    mutationFn: async () => {
      if (!product || !product.myBookmarkId) return;
      const myBookmarkId = product.myBookmarkId;
      removeBookmark(myBookmarkId);
    },
    onSuccess: () => {
      setIsLiked(false);
      queryClient.invalidateQueries({
        queryKey: ["products", product.extra.category],
      });
      // 전체 products 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
    onError: (error) => {
      console.error("좋아요 삭제 실패: ", error);
    },
  });

  const handleLike = () => {
    if (isLiked && product.myBookmarkId) {
      removeLike();
    } else {
      addLike();
    }
  };

  return {
    isLiked,
    handleLike,
  };
};
