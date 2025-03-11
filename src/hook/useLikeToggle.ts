import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductDetailType, ProductType } from "type/product";
import { fetchApi } from "lib/api";

export const useLikeToggle = (product: ProductType | ProductDetailType) => {
  const [isLiked, setIsLiked] = useState(!!product?.myBookmarkId);
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsLiked(!!product?.myBookmarkId);
  }, [product]);

  // 북마크 추가
  const { mutate: addLike } = useMutation({
    mutationFn: async () => {
      if (!product) return;
      const response = await fetchApi(`/bookmarks/product`, {
        body: JSON.stringify({
          target_id: product._id,
        }),
      });
      return response.data.item;
    },

    onSuccess: () => {
      setIsLiked(true);
      queryClient.invalidateQueries({
        queryKey: ["products", product.extra.category],
      });
    },
    onError: (error) => {
      console.error("찜 추가 실패: ", error);
    },
  });

  const { mutate: removeLike } = useMutation({
    mutationFn: async () => {
      if (!product || !product.myBookmarkId) return;
      const response = await fetchApi(`/bookmarks/${product.myBookmarkId}`, {
        method: "DELETE",
      });
      return response.data;
    },
    onSuccess: () => {
      setIsLiked(false);
      queryClient.invalidateQueries({
        queryKey: ["products", product.extra.category],
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
