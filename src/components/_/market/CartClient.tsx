"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import Button from "components/_/common/Button";
import Checkbox from "components/_/common/Checkbox";
import CartItem from "components/_/market/CartItem";
import ProductSmall from "components/_/market/ProductSmall";
import { clientFetchApi } from "lib/client-api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useCartStore } from "store/cartStore";
import { BookmarkItem, CartItems, CartResponse } from "type/cart";

interface Props {
  data?: CartItems[];
  bookmarkItem?: BookmarkItem[];
}

export default function CartClient({ data, bookmarkItem }: Props) {
  // 구매할 물품 선택을 위한 폼
  const { register, handleSubmit } = useForm();
  // 결제 버튼 보이기 상태
  const [showButton, setShowButton] = useState<boolean>(false);
  // 최종 상품 금액을 따로 상태로 관리
  const [totalFees, setTotalFees] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [totalPayFees, setTotalPayFees] = useState<number>(0);
  // 체크된 상품의 아이디를 담은 배열 상태 관리
  const [checkedItemsIds, setCheckedItemsIds] = useState<number[]>([]);
  // 보여줄 상품의 타입을 상태 관리
  const [renderCart, setRenderCart] = useState<boolean>(true);
  // CartStore 상태 가져오기
  const { setCart } = useCartStore();

  // targetRef가 보이면 결제버튼을 보이게 함
  const targetRef = useRef(null);

  const router = useRouter();

  // 스크롤에 따라 결제버튼 보이게 하기
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 타겟이 보이면 버튼 표시 상태 변경
            setShowButton(true);
          } else {
            setShowButton(false);
          }
        });
      },
      {
        // 뷰포트를 기준으로 감지
        root: null,
        // 10%만 보이면 트리거
        threshold: 0.1,
      }
    );

    const targetElement = targetRef.current;

    // 조건부 렌더링으로 targetRef가 사용하는 요소가 동적으로 생성되거나 사라질 경우에 에러를 발생시키지 않기 위해 조건문으로 검사 필요.
    if (targetElement) {
      observer.observe(targetElement);
    }

    // 컴포넌트 언마운트시 옵저버 해제 (메모리 누수 방지)
    return () => {
      if (targetElement) {
        observer.unobserve(targetElement);
      }
    };
  }, [data, renderCart]);

  // 장바구니 상품 삭제
  const queryClient = useQueryClient();
  const deleteItem = useMutation({
    mutationFn: async (_id: number) => {
      const ok = confirm("상품을 삭제하시겠습니까?");
      if (ok) {
        const res: CartResponse = await clientFetchApi(`/carts/${_id}`, {
          method: "DElETE",
        });
        return res;
      }
    },
    onSuccess: () => {
      toast.success("상품이 삭제되었습니다.");
      // 캐시된 데이터 삭제 후 리렌더링
      queryClient.invalidateQueries({ queryKey: ["carts"] });
    },
    onError: (err) => console.error(err),
  });

  // 장바구니 수량 변경
  const updateItem = useMutation({
    mutationFn: async ({
      _id,
      quantity,
    }: {
      _id: number;
      quantity: number;
    }) => {
      // _id는 장바구니 _id다 (상품의 _id는 product_id)
      const res: CartResponse = await clientFetchApi(`/carts/${_id}`, {
        method: "PATCH",
        body: JSON.stringify({
          quantity: quantity,
        }),
      });

      return res;
    },
    onSuccess: () => {
      // 캐시된 데이터 삭제 후 리렌더링
      queryClient.invalidateQueries({ queryKey: ["carts"] });
    },
    onError: (err) => console.error(err),
  });

  // 전체 선택 핸들러
  // 전체 선택 체크박스의 체크 상태를 인수로 받는다.
  const toggleCheckAll = (isChecked: boolean) => {
    // 전체 선택 체크박스가 체크되었을 때
    if (isChecked) {
      // 장바구니에 담긴 모든 아이템의 아이디를 checkedItemsIds 배열에 담음
      const allProductsIds = data?.map((item) => item._id);
      if (allProductsIds) setCheckedItemsIds(allProductsIds);
    } else {
      // 체크 해제되었으면 checkedItemsIds 배열을 빈 배열로 설정
      setCheckedItemsIds([]);
    }
  };

  // 장바구니 개별 아이템 체크 핸들러
  const toggleCartItemCheck = (targetId: number) => {
    // 체크한 상품을 장바구니 데이터에서 찾음
    const cartItem = data?.find((item) => item._id === targetId);

    // 체크한 상품의 product_id를 checkedCartItems 상태에 추가/제거
    if (cartItem)
      setCheckedItemsIds((prevCheckedIds) => {
        const isAlreadyChecked = prevCheckedIds.includes(cartItem._id);

        if (isAlreadyChecked) {
          return prevCheckedIds.filter((id) => id !== cartItem._id);
        }
        return [...prevCheckedIds, cartItem._id];
      });
  };

  // 장바구니 아이템 여러건 삭제
  const deleteItems = useMutation({
    mutationFn: async () => {
      if (checkedItemsIds.length !== 0) {
        const ok = confirm("선택한 상품을 삭제할까요?");
        if (ok) {
          setCheckedItemsIds([]);
          const res: CartResponse = await clientFetchApi("/carts", {
            method: "DELETE",
            body: JSON.stringify({
              data: {
                carts: checkedItemsIds,
              },
            }),
          });
          return res;
        }
      } else {
        toast.warning("삭제할 상품을 선택하세요.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carts"] });
    },
    onError: (err) => console.error(err),
  });

  // 선택한 아이템, 데이터가 변경될 때 상품 금액, 할인 금액 다시 계산
  useEffect(() => {
    // 체크한 상품이 없다면 총금액, 할인금액을 0으로 설정하고 빠져나감
    if (checkedItemsIds.length === 0) {
      setTotalFees(0);
      setDiscount(0);
      return;
    }

    const { subtotal, totalDiscount } = checkedItemsIds.reduce(
      (acc, checkedId) => {
        // 장바구니에서 아이템 찾기
        const currentCartItem = data?.find((item) => item._id === checkedId);

        // 해당 아이템의 총 합산 금액 구하기
        if (!currentCartItem) return acc;

        const itemTotal =
          currentCartItem?.quantity * currentCartItem?.product.price;

        // 해당 아이템의 할인 금액 구하기
        const itemDiscount =
          currentCartItem?.quantity *
          (currentCartItem?.product.price -
            currentCartItem?.product.extra.saledPrice);

        return {
          subtotal: acc.subtotal + itemTotal, // 상품 금액 합계
          totalDiscount: acc.totalDiscount + itemDiscount, // 할인 금액 합계
        };
      },
      // 초기값 설정
      { subtotal: 0, totalDiscount: 0 }
    );

    setTotalFees(subtotal);
    setDiscount(totalDiscount);
  }, [checkedItemsIds, data]);

  // 총 결제금액 업데이트
  useEffect(() => {
    setTotalPayFees(totalFees - discount);
  }, [totalFees, discount]);

  // 데이터 없을시 null 반환하여 에러 방지
  if (!data && !bookmarkItem) return null;

  // 최종 배송비 계산
  const totalShippingFees = totalFees > 30000 || totalFees === 0 ? 0 : 2500;

  // 장바구니 아이템으로 화면 렌더링
  const itemList = data?.map((item) => (
    <CartItem
      key={item._id}
      {...item}
      register={register}
      deleteItem={deleteItem}
      updateItem={updateItem}
      toggleCartItemCheck={toggleCartItemCheck}
      isChecked={checkedItemsIds.includes(item._id)}
    />
  ));

  // 찜한 상품으로 화면 렌더링
  const bookmarkItems = bookmarkItem?.map((item) => (
    <ProductSmall key={item._id} product={item} bookmarkId={item._id} />
  ));

  // 체크한 아이템의 데이터가 담긴 배열을 구매 페이지로 전송
  const selectItem = () => {
    if (checkedItemsIds.length === 0) {
      toast.error("구매할 물품을 선택하세요");
      return;
    }

    // 결제 페이지로 체크한 상품의 데이터 넘기기
    const selectedItems = checkedItemsIds
      .map((_id) =>
        // 각각의 id 마다 checkedItemsIds에 담긴 id와 같은 상품을 장바구니에서 찾아서 리턴
        data?.find((item) => item._id === _id)
      )
      // 타입 가드
      .filter((item) => item !== undefined);
    const currentUrl = window.location.href;

    // 스토어에 선택한 아이템들의 정보를 저장
    setCart({
      // seletedItems : 체크한 아이템의 아이디가 딤긴 배열
      // totalFees : 최종 상품 금액
      // totalShippingFees : 최종 배송비
      items: selectedItems,
      totalFees: totalPayFees,
      totalShippingFees,
      previousUrl: currentUrl,
    });
    router.push("/payment");
  };

  return (
    <>
      <div>
        <section className="flex h-9 font-semibold border-b border-gray2 *:flex *:grow *:cursor-pointer *:self-stretch *:items-center *:justify-center">
          <div
            className={`${
              renderCart ? "border-b-2 border-btn-primary" : "text-gray3"
            }`}
            onClick={() => setRenderCart(true)}
          >
            담은 상품({itemList?.length})
          </div>
          <div
            className={`${
              renderCart ? "text-gray3 " : "border-b-2 border-btn-primary"
            }`}
            onClick={() => setRenderCart(false)}
          >
            찜한 상품({bookmarkItem?.length})
          </div>
        </section>
        <>
          {/* 장바구니 상품 혹은 찜한 상품 조건부 렌더링 */}
          {renderCart ? (
            <div>
              {itemList && itemList.length > 0 ? (
                <>
                  <section className="py-[14px] px-5 flex gap-[6px] items-center border-b border-gray2">
                    <label
                      className="flex items-center cursor-pointer relative gap-2 grow"
                      htmlFor="checkAll"
                    >
                      <Checkbox
                        id="checkAll"
                        name="checkAll"
                        checked={checkedItemsIds.length === data?.length}
                        onChange={(e) => toggleCheckAll(e.target.checked)}
                      />
                      전체 선택 ({checkedItemsIds.length}/{itemList?.length})
                    </label>
                    <Button onClick={() => deleteItems.mutate()}>삭제</Button>
                  </section>
                  <form onSubmit={handleSubmit(selectItem)}>
                    <section className="px-5 pb-4 border-b-4 border-gray2">
                      {itemList}
                    </section>
                    <section className="px-5 py-3">
                      <div className="border-b border-gray2">
                        <div className="text-xs flex justify-between mb-3">
                          <span className="text-gray4">총 상품 금액</span>
                          <span>{totalFees.toLocaleString()}원</span>
                        </div>
                        <div className="text-xs flex justify-between mb-3">
                          <span className="text-gray4">할인 금액</span>
                          <span className="text-red1">
                            {discount === 0
                              ? `${discount}원`
                              : `- ${discount.toLocaleString()}원`}
                          </span>
                        </div>
                        <div className="text-xs flex justify-between mb-3">
                          <span className="text-gray4">배송비</span>
                          <span>
                            {totalShippingFees === 0
                              ? "무료"
                              : `+ ${totalShippingFees.toLocaleString()}원`}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between mb-3 py-3 text-[16px] font-bold">
                        <span>총 결제 금액</span>
                        <span>
                          {(totalPayFees + totalShippingFees).toLocaleString()}
                          원
                        </span>
                      </div>
                    </section>
                    <div
                      ref={targetRef}
                      style={{ height: "1px", background: "transparent" }}
                    ></div>
                    <section
                      className={clsx(
                        "max-w-[390px] mx-auto px-5 py-8 bg-gray1 shadow-top fixed left-0 right-0 transition-all duration-150 ease-in-out",
                        showButton
                          ? "bottom-0 opacity-100"
                          : "-bottom-24 opacity-0"
                      )}
                    >
                      <Button isBig={true} type="submit">
                        {(totalPayFees + totalShippingFees).toLocaleString()}원
                        구매하기
                      </Button>
                    </section>
                  </form>
                </>
              ) : (
                <>
                  <section className="pt-[100px] flex flex-col gap-[10px] items-center text-[14px]">
                    <span className="text-gray4">담은 상품이 없습니다.</span>
                    <Link href="/" className="text-bg-primary underline">
                      쇼핑하러 가기
                    </Link>
                  </section>
                </>
              )}
            </div>
          ) : (
            // 찜한 상품렌더링
            <div>
              {bookmarkItem && bookmarkItem.length > 0 ? (
                <div className="grid grid-cols-3 gap-x-2 gap-y-4 py-2 px-5">
                  {bookmarkItems}
                </div>
              ) : (
                <section className="pt-[100px] flex flex-col gap-[10px] items-center text-[14px]">
                  <span className="text-gray4">찜한 상품이 없습니다.</span>
                  <Link href="/" className="text-bg-primary underline">
                    쇼핑하러 가기
                  </Link>
                </section>
              )}
            </div>
          )}
        </>
      </div>
    </>
  );
}
