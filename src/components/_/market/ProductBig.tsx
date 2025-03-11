"use client";

import { useLikeToggle } from "hook/useLikeToggle";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ProductType } from "type/product";

const likeIcon = {
  default: "/icons/icon_likeHeart_no.svg",
  active: "/icons/icon_likeHeart_yes.svg",
};

export default function ProductBig(product: ProductType) {
  const router = useRouter();

  const goDetailPage = () => {
    router.push(`/product/${product._id}`);
  };

  const { isLiked, handleLike } = useLikeToggle(product);

  return (
    <section
      className="flex flex-col shrink-0 py-5 w-[201px] cursor-pointer"
      onClick={goDetailPage}
    >
      <div className="relative">
        <Image
          className="h-[279px] rounded-lg object-cover"
          width={0}
          height={0}
          alt={product.name}
          src={`https://11.fesp.shop${product.mainImages[0]?.path}`}
        />
        <button
          className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow-bottom"
          onClick={(e) => {
            e.stopPropagation();
            handleLike();
          }}
        >
          <Image
            src={isLiked ? likeIcon.active : likeIcon.default}
            alt="subscribe button"
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
            {product.extra.sale}%
          </span>
          <span className="font-extrabold text-lg line-clamp-1">
            {product.extra.saledPrice.toLocaleString()}원
          </span>
        </div>
        <span className="font-semibold text-xs pr-2">
          ⭐️ {product.rating ? product.rating.toFixed(1) : 0}
        </span>
        <span className="text-gray4 font-regular text-xs">
          {" "}
          ({product.replies})
        </span>
      </div>
    </section>
  );
}
