import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientFetchApi } from "lib/client-api";
import { revalidateProductsCache } from "server-action";
import { BookmarkDelete } from "type/bookmarks";
import { ProductDetailType, ProductType } from "type/product";

interface useBookmarkMutationProps {
  product?: ProductType | ProductDetailType;
  bookmarkId?: number; // 북마크 product가 remove될 때 사용
  onSuccessAdd?: () => void;
  onSuccessRemove?: () => void;
  // 클라이언트 invalidate할 쿼리 키 목록
  additionalInvalidateKeys?: readonly unknown[][];
}

export const useBookmarkMutation = ({
  product,
  bookmarkId,
  onSuccessAdd,
  onSuccessRemove,
  additionalInvalidateKeys = [],
}: useBookmarkMutationProps) => {
  const queryClient = useQueryClient();
  const myBookmarkId = product?.myBookmarkId;

  const invalidateAll = async () => {
    // 기본 쿼리 키 무효화
    queryClient.invalidateQueries({
      queryKey: ["products", product?.extra.category],
    });

    // 추가 쿼리 키 무효화
    for (const key of additionalInvalidateKeys) {
      queryClient.invalidateQueries({
        queryKey: key,
      });
    }

    // 서버측 캐시 무효화
    await revalidateProductsCache(product?.extra.category);
  };

  // 북마크 추가
  const addBookmark = useMutation({
    mutationFn: async () => {
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
      return res.data;
    },
    onSuccess: async () => {
      onSuccessAdd?.();

      await invalidateAll();
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

  const removeBookmark = useMutation({
    mutationFn: async () => {
      // ProductSmall 컴포넌트에서 북마크 삭제시
      if (!product && bookmarkId) {
        const res: BookmarkDelete = await clientFetchApi(
          `/bookmarks/${bookmarkId}`,
          {
            method: "DELETE",
          }
        );
        return res;
      } else {
        // Product 컴포넌트에서 북마크 삭제시
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
        return res.data;
      }
    },
    onSuccess: async () => {
      onSuccessRemove?.();
      await invalidateAll();
    },
    onError: (error) => {
      try {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        const errorObj = JSON.parse(errorMessage);
        console.error("찜 삭제 실패: ", errorObj);
      } catch (parseError) {
        console.error("에러 파싱 실패", parseError);
      }
    },
  });

  return { addBookmark, removeBookmark };
};
