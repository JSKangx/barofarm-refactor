"use clent";

import { useQuery } from "@tanstack/react-query";
import { clientFetchApi } from "lib/client-api";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useUserStore } from "store/userStore";
import { CartResponse } from "type/cart";

interface HeaderIconProps {
  name: string;
  onClick: () => void;
}

export default function HeaderIcon({ name, onClick }: HeaderIconProps) {
  // 장바구니가 차 있는지 아닌지 확인하는 상태관리 변수
  const [isFullCart, setIsFullCart] = useState<boolean>(false);

  // zustand store에서 유저 상태 가져옴
  const user = useUserStore((store) => store.user);

  // 장바구니 아이콘에 상품 개수를 표시하기 위한 장바구니 상품 목록 조회
  const { data } = useQuery({
    queryKey: ["carts"],
    queryFn: async () => {
      const res: CartResponse = await clientFetchApi("/carts", {
        method: "GET",
      });
      return res;
    },
    select: (res) => res.item,
    staleTime: 1000 * 10,
    enabled: !!user,
  });

  const iconPath = `/icons/icon_${name}.svg`;

  // 장바구니 아이콘이고, 장바구니가 차 있으면 상태를 변경
  useEffect(() => {
    if (data && name.startsWith("cart") && data.length > 0) {
      setIsFullCart(true);
    }
  }, [data, user, name]);

  return (
    <button onClick={onClick} className="relative">
      <Image width={34} height={34} src={iconPath} alt={`${iconPath} icon`} />
      {isFullCart && (
        <span className="flex justify-center items-center text-xs text-white absolute size-4 bg-red1 rounded-full right-0 top-0">
          {data?.length}
        </span>
      )}
    </button>
  );
}
