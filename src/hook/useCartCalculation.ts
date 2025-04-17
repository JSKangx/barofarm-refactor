import { useEffect, useMemo, useState } from "react";
import { CartItems } from "type/cart";

// 계산을 위한 중간 결과 인터페이스
interface CalculationResult {
  subtotal: number;
  totalDiscount: number;
}

// 상수 정의
const FREE_SHIPPING_THRESHOLD = 30000;
const BASE_SHIPPING_FEE = 2500;

export const useCartCalculation = (
  checkedItemsIds: number[],
  data?: CartItems[]
) => {
  // 최종 상품 금액을 따로 상태로 관리
  const [totalFees, setTotalFees] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [totalPayFees, setTotalPayFees] = useState<number>(0);

  // 계산 로직을 순수 함수로 분리
  const calculateTotals = (ids: number[], data?: CartItems[]) => {
    // 체크한 상품이 없다면 총금액, 할인금액을 0으로 설정하고 빠져나감
    if (ids.length === 0) {
      return { subtotal: 0, totalDiscount: 0 };
    }

    // 체크한 상품이 있다면 총액 계산
    return ids.reduce<CalculationResult>(
      (acc, checkedId) => {
        // 장바구니에서 아이템 찾기
        const currentCartItem = data?.find((item) => item._id === checkedId);

        // 아이템이 없으면 누적값 그대로 반환
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
      { subtotal: 0, totalDiscount: 0 }
    );
  };

  // 메모이제이션으로 불필요한 재계산 방지
  const calculatedTotals = useMemo(
    () => calculateTotals(checkedItemsIds, data),
    [checkedItemsIds, data]
  );

  // 상품 금액과 할인 금액 업데이트
  useEffect(() => {
    setTotalFees(calculatedTotals.subtotal);
    setDiscount(calculatedTotals.totalDiscount);
  }, [calculatedTotals]);

  // 총 결제금액 업데이트
  useEffect(() => {
    setTotalPayFees(totalFees - discount);
  }, [totalFees, discount]);

  // 배송비 계산 (3만원 이상 무료배송)
  const totalShippingFees = useMemo(
    () =>
      totalFees > FREE_SHIPPING_THRESHOLD || totalFees === 0
        ? 0
        : BASE_SHIPPING_FEE,
    [totalFees]
  );

  return { totalFees, discount, totalPayFees, totalShippingFees };
};
