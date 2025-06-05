import { useState, useEffect } from "react";
import { ProductDetailType, ProductType } from "type/product";
import { useBookmarkMutation } from "hook/useBookmarkMutation";

export const useLikeToggle = (product: ProductType | ProductDetailType) => {
  const [isLiked, setIsLiked] = useState(!!product?.myBookmarkId);

  useEffect(() => {
    setIsLiked(!!product?.myBookmarkId);
  }, [product]);

  const { addBookmark, removeBookmark } = useBookmarkMutation({
    product,
    onSuccessAdd: () => {
      setIsLiked(true);
    },
    onSuccessRemove: () => {
      setIsLiked(false);
    },
  });

  const handleLike = () => {
    if (isLiked && product.myBookmarkId) {
      removeBookmark.mutate();
    } else {
      addBookmark.mutate();
    }
  };

  return {
    isLiked,
    handleLike,
  };
};
