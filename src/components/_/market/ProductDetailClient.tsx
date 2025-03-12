"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DetailProps } from "app/(market)/product/[_id]/page";
import Modal, { ModalType } from "components/_/market/Modal";
import PurchaseModal, {
  PurchaseModalType,
} from "components/_/market/PurchaseModal";
import ReviewBox from "components/_/market/ReviewBox";
import { useLikeToggle } from "hook/useLikeToggle";
import { fetchApi } from "lib/api";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ProductDetailType } from "type/product";

// 타입 정의
type Props = DetailProps & {
  product: ProductDetailType;
};

const likeIcon = {
  default: "/icons/icon_likeHeart_no.svg",
  active: "/icons/icon_likeHeart_yes.svg",
};

export default function ProductDetailClient({ params, product }: Props) {
  const { _id } = params;
  const router = useRouter();
  const queryClient = useQueryClient();

  // 이 상품을 세션 스토리지에 저장하는 함수
  if (!!product) {
    // 세션 스토리지에 저장된 데이터가 있다면 가져오고, 아니면 빈 배열로 초기화
    let productData = JSON.parse(sessionStorage.getItem("productData") || "[]");

    // 중복된 객체를 제거
    productData = productData.filter(
      (item: ProductDetailType) => item && item._id !== product._id
    );

    // 새로운 상품 추가
    productData.unshift(product);

    // // 최대 10개까지만 유지
    if (productData.length > 10) {
      productData.pop();
    }

    // 저장
    sessionStorage.setItem("productData", JSON.stringify(productData));
  }

  const { isLiked, handleLike } = useLikeToggle(product);

  // ref의 초기값을 명확히 null로 지정해주고, 참조할 타입을 지정해줘야 타입스크립트가 혼란스러워하지 않는다.
  const purchaseModalRef = useRef<PurchaseModalType>(null);
  const modalRef = useRef<ModalType>(null);

  const openPurchaseModal = () => {
    purchaseModalRef.current?.open();
  };

  const openModal = () => {
    modalRef.current?.open();
    purchaseModalRef.current?.close();
  };

  // 상품 수량 선택 상태관리
  const [count, setCount] = useState<number>(1);

  // 상품 수량 상태관리
  const handleCount = (sign: string) => {
    if (sign === "plus") setCount((count) => count + 1);
    else if (sign === "minus" && count > 1) setCount((count) => count - 1);
  };

  // 카트에 상품 추가 함수
  const cartItem = useMutation({
    mutationFn: async () => {
      const response = await fetchApi(`/carts`, {
        method: "POST",
        body: JSON.stringify({
          product_id: parseInt(_id),
          quantity: count,
        }),
      });
      return response.data.item;
    },
    onSuccess: () => {
      openModal();
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      console.error("Error adding to cart", error);
    },
  });

  return (
    <>
      <Image
        width={390}
        height={330}
        alt={product.name}
        className="object-cover"
        src={`https://11.fesp.shop${product.mainImages[0]?.path}`}
      />
      <section className="p-5 border-b-8 border-b-gray1">
        <div className="flex items-center gap-[10px] pb-5">
          <Image
            width={25}
            height={25}
            alt={product.name}
            src={`https://11.fesp.shop${product.seller.image}`}
            className="rounded-full"
          />
          <span className="font-semibold ">{product.seller.name}</span>
        </div>

        <p>{product.name}</p>

        <span className="font-semibold text-xs pr-2">
          ⭐️ {product.rating ? product.rating.toFixed(1) : 0}
        </span>
        <span className="text-xs">{product.replies.length}개 후기</span>

        <div className="pt-1">
          {product.extra.sale !== 0 ? (
            <>
              <span className="text-gray4 font-semibold pr-1">
                {product.extra.sale}%
              </span>
              <span className="font-semibold text-gray3 line-through">
                {product.price.toLocaleString()}원
              </span>
            </>
          ) : undefined}
          <p
            className={`font-extrabold text-xl ${
              product.extra.sale !== 0 ? "text-btn-primary" : "text-black"
            }`}
          >
            {product.extra.saledPrice.toLocaleString()}원
          </p>
        </div>
      </section>

      <section className="p-5 border-b-8 border-b-gray1">
        <div className="flex items-center justify-between">
          <span className="font-bold">후기 {product.replies.length}개</span>
          {product.replies.length > 0 ? (
            <Link
              href={`/product/${product._id}/reviews`}
              className="font-medium text-sm text-gray5 flex items-center"
            >
              전체보기
              <Image
                width={12}
                height={12}
                src="/icons/icon_forward.svg"
                alt="arrow icon"
              />
            </Link>
          ) : undefined}
        </div>
        <div className="flex overflow-x-auto gap-3 scrollbar-hide">
          {product.replies.map((reply) => (
            <ReviewBox
              key={reply._id}
              option={product.name}
              content={reply.content}
            />
          ))}
        </div>
      </section>

      <section className="p-5 border-b-8 border-b-gray1">
        <div dangerouslySetInnerHTML={{ __html: product.content }} />
      </section>

      <footer className="h-[95px] p-5 border-t border-gray1 flex items-center justify-between fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto bg-white">
        <button onClick={handleLike} className="pl-2">
          <img
            src={isLiked ? likeIcon.active : likeIcon.default}
            className="w-10"
          />
          <span className="text-sm font-medium">찜</span>
        </button>
        <button
          onClick={openPurchaseModal}
          className="w-[280px] text-lg text-white bg-btn-primary p-4 rounded-[10px]"
        >
          구매하기
        </button>
      </footer>

      <PurchaseModal ref={purchaseModalRef}>
        <p className="text-sm font-semibold">개수 선택</p>
        <div className="text-sm border border-gray3 rounded-[10px] p-5">
          <p>{product.name}</p>
          <div className="flex gap-2 items-center mt-5">
            <button
              className="w-6 h-6 bg-gray2 rounded-[5px]  text-white flex items-center justify-center"
              onClick={() => handleCount("minus")}
            >
              -
            </button>
            <span className="w-10 h-6 border rounded-[5px] flex items-center justify-center">
              {count}
            </span>
            <button
              className="w-6 h-6 bg-gray2 rounded-[5px]  text-white flex items-center justify-center"
              onClick={() => handleCount("plus")}
            >
              +
            </button>
            <span className="ml-auto text-base font-semibold">
              {(product.extra.saledPrice * count).toLocaleString()}원
            </span>
            <span className="text-[12px] text-red1 mt-[3px]">
              (-
              {(
                (product.price - product.extra.saledPrice) *
                count
              ).toLocaleString()}
              원 할인)
            </span>
          </div>
        </div>
        <div className="bg-gray1 border-y border-gray3 border-t py-3 flex justify-center">
          <p>
            상품 금액 {(product.extra.saledPrice * count).toLocaleString()} 원 +
            배송비 {product.shippingFees.toLocaleString()} 원
          </p>
        </div>
        <div className="flex justify-between gap-3">
          <button
            className="flex-1 text-lg text-btn-primary p-3 rounded-[10px] border border-btn-primary"
            onClick={() => cartItem.mutate()}
          >
            장바구니
          </button>
          <button
            className="flex-1 text-lg text-white bg-btn-primary p-3 rounded-[10px]"
            onClick={() => {
              if (!user) {
                navigateLogin();
              } else {
                const currentUrl = window.location.href;
                navigate("/payment", {
                  state: {
                    selectedItems: purchaseItem,
                    totalFees: product.extra.saledPrice * count,
                    totalShippingFees: product.shippingFees,
                    previousUrl: currentUrl,
                  },
                });
              }
            }}
          >
            구매하기
          </button>
        </div>
      </PurchaseModal>
      <Modal ref={modalRef}>
        <p className="text-center text-lg font-">
          <strong className="font-semibold">장바구니</strong>에 <br /> 상품을
          담았어요
        </p>
        <div className="relative w-[66px]">
          <Image
            fill
            src="/icons/icon_cart_modal.svg"
            className="w-[66px]"
            alt="cart icon"
          />
        </div>
        <Link href="/cart">
          <span className="font-light border-b border-b-black">바로가기</span>
        </Link>
      </Modal>
    </>
  );
}
