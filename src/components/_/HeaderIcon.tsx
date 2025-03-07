// import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
// import { useEffect, useState } from "react";

interface HeaderIconProps {
  name: string;
  onClick: () => void;
}

export default function HeaderIcon({ name, onClick }: HeaderIconProps) {
  // const axios = useAxiosInstance();
  // 장바구니가 차 있는지 아닌지 확인하는 상태관리 변수
  // const [isFullCart, setIsFullCart] = useState(false);

  // zustand store에서 유저 상태 가져옴
  // const user = useUserStore((store) => store.user);

  // 장바구니 아이콘에 상품 개수를 표시하기 위한 장바구니 상품 목록 조회
  // const { data } = useQuery({
  //   queryKey: ["carts"],
  //   queryFn: () => axios.get("https://11.fesp.shop/carts"),
  //   select: (res) => res.data,
  //   staleTime: 1000 * 10,
  //   enabled: !!user,
  // });

  const iconPath = `/icons/icon_${name}.svg`;

  // 로그인되지 않은 사용자가 장바구니에 접근할 때 리다이렉트
  // const navigate = useNavigate();
  // function navigateLogin() {
  //   const gotoLogin = confirm(
  //     "로그인 후 이용 가능합니다.\n로그인 페이지로 이동하시겠습니까?"
  //   );
  //   if (gotoLogin)
  //     navigate("/users/login", { state: { from: location.pathname } });
  // }

  // 장바구니 아이콘이고, 장바구니가 차 있으면 상태를 변경
  // useEffect(() => {
  //   if (data && name.startsWith("cart") && data.item.length > 0) {
  //     setIsFullCart(true);
  //   }
  // }, [data, user]);

  return (
    <button
      onClick={
        // !user && name.startsWith("cart") ? () => navigateLogin() :
        onClick
      }
      className="relative"
    >
      <Image width={34} height={34} src={iconPath} alt={`${iconPath} icon`} />
      {/* {isFullCart && (
        <span className="flex justify-center items-center text-xs text-white absolute size-4 bg-red1 rounded-full right-0 top-0">
          {data.item.length}
        </span>
      )} */}
    </button>
  );
}
