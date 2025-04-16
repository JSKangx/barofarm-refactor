interface Props {
  totalFees: number;
  discount: number;
  totalShippingFees: number;
  totalPayFees: number;
}

export default function CartSummuray({
  totalFees,
  discount,
  totalShippingFees,
  totalPayFees,
}: Props) {
  return (
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
        <span>{(totalPayFees + totalShippingFees).toLocaleString()}원</span>
      </div>
    </section>
  );
}
