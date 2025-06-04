"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import Button from "components/_/common/Button";
import CartHeader from "components/_/market/cart/CartHeader";
import Checkbox from "components/_/common/Checkbox";
import CartItem from "components/_/market/cart/CartItem";
import ProductSmall from "components/_/market/ProductSmall";
import { clientFetchApi } from "lib/client-api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useCartStore } from "store/cartStore";
import { BookmarkItem, CartItems, CartResponse } from "type/cart";
import CartSummuray from "components/_/market/cart/CartSummury";
import { useCartCalculation } from "hook/useCartCalculation";
import { useScrollVisibility } from "hook/useScrollVisibility";

interface Props {
  data?: CartItems[];
  bookmarkItem?: BookmarkItem[];
}

export default function CartClient({ data, bookmarkItem }: Props) {
  // 구매할 물품 선택을 위한 폼
  const { register, handleSubmit } = useForm();
  // 결제 버튼 보이기 상태
  const [showButton, setShowButton] = useState<boolean>(false);
  // 체크된 상품의 아이디를 담은 배열 상태 관리
  const [checkedItemsIds, setCheckedItemsIds] = useState<number[]>([]);
  // 보여줄 상품의 타입을 상태 관리
  const [isCartView, setIsCartView] = useState<boolean>(true);
  // CartStore 상태 가져오기
  const { setCart } = useCartStore();

  const router = useRouter();

  // 스크롤에 따라 결제버튼 보이게 하기
  // targetRef가 보이면 결제버튼을 보이게 함
  const targetRef = useRef(null);
  useScrollVisibility(setShowButton, data, isCartView, targetRef);

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

  // 상품 금액, 할인 금액, 총 결제 금액을 계산하는 커스텀 훅
  const { totalFees, discount, totalPayFees, totalShippingFees } =
    useCartCalculation(checkedItemsIds, data);

  // 데이터 없을시 null 반환하여 에러 방지
  if (!data && !bookmarkItem) return null;

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
        <CartHeader
          isCartView={isCartView}
          setIsCartView={setIsCartView}
          itemList={itemList}
          bookmarkItem={bookmarkItem}
        />
        <>
          {/* 장바구니 상품 혹은 찜한 상품 조건부 렌더링 */}
          {isCartView ? (
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
                    <CartSummuray
                      totalFees={totalFees}
                      discount={discount}
                      totalShippingFees={totalShippingFees}
                      totalPayFees={totalPayFees}
                    />
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
