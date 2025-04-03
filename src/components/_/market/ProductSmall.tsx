"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ProductType } from "type/product";
import { useRouter } from "next/navigation";
import { clientFetchApi } from "lib/client-api";
import { CartResponse } from "type/cart";
import Image from "next/image";
import Button from "components/_/common/Button";

const likeIcon = {
  default: "/icons/icon_likeHeart_no.svg",
  active: "/icons/icon_likeHeart_yes.svg",
};

interface Props {
  product: ProductType;
  bookmarkId: number;
}

export default function ProductSmall({ product, bookmarkId }: Props) {
  const router = useRouter();

  // 상품을 누르면 상품 상세 페이지로 이동
  const goDetailPage = () => {
    router.push(`/product/${product._id}`);
  };

  const queryClient = useQueryClient();
  // 북마크 해제 기능
  const deleteBookmark = useMutation({
    mutationFn: async () => {
      const res = await clientFetchApi(`/bookmarks/${bookmarkId}`, {
        method: "DELETE",
      });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks", "product"] });
      queryClient.invalidateQueries({ queryKey: ["carts"] });
    },
  });

  // 장바구니에 추가 기능
  const addCartItem = useMutation({
    mutationFn: async () => {
      const res: CartResponse = await clientFetchApi("/carts", {
        method: "POST",
        body: JSON.stringify({
          product_id: product._id,
          quantity: 1,
        }),
      });
      return res;
    },
    onSuccess: () => {
      deleteBookmark.mutate();
      toast.success("장바구니에 추가되었습니다.");
    },
    onError: (error) => {
      console.error("Error adding to cart", error);
    },
  });

  return (
    <section className="flex flex-col cursor-pointer">
      <div className="relative">
        <Image
          width={110}
          height={110}
          className="aspect-square rounded-lg object-cover w-full"
          alt={product.name}
          src={`https://11.fesp.shop${product.mainImages[0]?.path}`}
          onClick={goDetailPage}
        />
        <button
          className="absolute bottom-3 right-3 bg-white p-1.5 rounded-full shadow-bottom"
          onClick={(e) => {
            e.stopPropagation();
            deleteBookmark.mutate();
            queryClient.invalidateQueries({
              queryKey: ["bookmarks", "product"],
            });
          }}
        >
          <Image
            width={20}
            height={20}
            className="w-5"
            src={likeIcon.active}
            alt="북마크 아이콘"
          />
        </button>
      </div>
      <div className="pl-[5px] pt-[10px]" onClick={goDetailPage}>
        <p className="text-xs line-clamp-1">{product.name}</p>
        <div className="pt-1 flex items-center">
          <span className="text-red1 font-semibold text-base pr-1">
            {product.extra.sale}%
          </span>
          <span className="font-extrabold text-lg line-clamp-1">
            {product.extra.saledPrice.toLocaleString()}원
          </span>
        </div>
      </div>
      <div className="self-center">
        <Button isWhite={true} onClick={() => addCartItem.mutate()}>
          장바구니 담기
        </Button>
      </div>
    </section>
  );
}
