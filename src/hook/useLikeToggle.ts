import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductDetailType, ProductType } from "type/product";
import { useUserStore } from "store/userStore";
import { usePathname } from "next/navigation";
import useAuth from "hook/useAuth";
import { clientFetchApi } from "lib/client-api";
import { revalidateProductsCache } from "server-action";

export const useLikeToggle = (product: ProductType | ProductDetailType) => {
  const [isLiked, setIsLiked] = useState(!!product?.myBookmarkId);
  const queryClient = useQueryClient();
  const { user } = useUserStore(); // 유저 정보 가져오기
  const requireAuth = useAuth();
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
      const res = await clientFetchApi("/bookmarks/product", {
        method: "POST",
        body: JSON.stringify({
          target_id: productId,
        }),
      });

      if (!res.ok) {
        throw new Error(
          JSON.stringify({
            message: res.message,
            errors: res.errors,
          })
        );
      }
      console.log(res);
      return res.data;
    },
    onSuccess: async () => {
      setIsLiked(true);
      console.log("찜추가 성공");

      // 클라이언트측 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ["products", product.extra.category],
      });

      // 서버측 캐시 무효화
      await revalidateProductsCache(product.extra.category);
    },
    onError: (error) => {
      try {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        const errorObj = JSON.parse(errorMessage);
        console.error("찜 추가 실패: ", errorObj);
      } catch (parseError) {
        console.error("에러 파싱 실패", parseError);
      }
    },
  });

  const { mutate: removeLike } = useMutation({
    mutationFn: async () => {
      if (!product || !product.myBookmarkId) return;
      const myBookmarkId = product.myBookmarkId;
      const res = await clientFetchApi(`/bookmarks/${myBookmarkId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error(
          JSON.stringify({
            message: res.message,
            errors: res.errors,
          })
        );
      }
      console.log(res);
      return res.data;
    },
    onSuccess: async () => {
      setIsLiked(false);
      console.log("찜삭제 성공");
      // 클라이언트측 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ["products", product.extra.category],
      });
      // 서버측 캐시 무효화
      await revalidateProductsCache(product.extra.category);
    },
    onError: (error) => {
      try {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        const errorObj = JSON.parse(errorMessage);
        console.error("찜 추가 실패: ", errorObj);
      } catch (parseError) {
        console.error("에러 파싱 실패", parseError);
      }
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
