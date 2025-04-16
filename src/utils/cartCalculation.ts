import { CartItems } from "type/cart";

interface Props {
  checkedItemsIds: number[];
  data: CartItems[] | undefined;
}

export const cartCalculation = ({ checkedItemsIds, data }: Props) => {
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

  return { subtotal, totalDiscount };
};
