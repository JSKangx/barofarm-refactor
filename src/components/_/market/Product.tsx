"use client";

import { useLikeToggle } from "hook/useLikeToggle";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ProductType } from "type/product";

const likeIcon = {
  default: "/icons/icon_likeHeart_no.svg",
  active: "/icons/icon_likeHeart_yes.svg",
};

export default function Product(product: ProductType) {
  const router = useRouter();

  const goDetailPage = () => {
    router.push(`/product/${product._id}`);
  };

  const { isLiked, handleLike } = useLikeToggle(product);

  return (
    <section className="flex flex-col cursor-pointer" onClick={goDetailPage}>
      <div className="relative">
        <Image
          priority
          width={0}
          height={0}
          sizes="100%"
          className="h-[160px] rounded-lg object-cover w-full"
          alt={product.name}
          src={`https://11.fesp.shop${product.mainImages[0]?.path}`}
        />
        <button
          className="absolute bottom-3 right-3 bg-white p-1.5 rounded-full shadow-bottom"
          onClick={(e) => {
            e.stopPropagation();
            handleLike();
          }}
        >
          <Image
            width={20}
            height={20}
            className="w-5"
            src={isLiked ? likeIcon.active : likeIcon.default}
            alt="like icon"
          />
        </button>
      </div>
      <div className="pl-[5px] pt-[10px]">
        <span className="font-semibold pt-[10px] text-sm">
          {product.seller.name}
        </span>
        <p className="text-xs line-clamp-1">{product.name}</p>
        <div className="pt-1 flex items-center">
          <span className="text-red1 font-semibold text-base pr-1">
            {product.extra.sale !== 0 ? `${product.extra.sale}%` : undefined}
          </span>
          <span className="font-extrabold text-lg line-clamp-1">
            {product.extra.saledPrice.toLocaleString()}원
          </span>
        </div>
        <span className="font-semibold text-xs pr-2">
          ⭐️ {product.rating ? product.rating.toFixed(1) : 0}
        </span>
        <span className="text-gray4 font-regular text-xs ">
          (
          {Array.isArray(product.replies)
            ? product.replies.length > 0
              ? product.replies.length
              : 0
            : product.replies}
          )
        </span>
      </div>
    </section>
  );
}
