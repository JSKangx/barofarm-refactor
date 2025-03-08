"use client";

import NavItem from "components/_/NavItem";
import { usePathname } from "next/navigation";

const icons = {
  category: {
    default: "/icons/icon_category_empty.svg",
    active: "/icons/icon_category_full.svg",
  },
  community: {
    default: "/icons/icon_comm_empty.svg",
    active: "/icons/icon_comm_full.svg",
  },
  home: {
    default: "/icons/icon_home_empty.svg",
    active: "/icons/icon_home_full.svg",
  },
  profile: {
    default: "/icons/icon_profile_empty.svg",
    active: "/icons/icon_profile_full.svg",
  },
  cart: {
    default: "/icons/icon_cart_empty.svg",
    active: "/icons/icon_cart_full.svg",
  },
};

export default function Navbar() {
  // const { user } = useUserStore();
  // const navigate = useNavigate();
  // function navigateLogin() {
  //   const gotoLogin = confirm(
  //     "로그인 후 이용 가능합니다.\n로그인 페이지로 이동하시겠습니까?"
  //   );
  //   if (gotoLogin)
  //     navigate("/users/login", { state: { from: location.pathname } });
  // }

  // 현재 경로 접근
  const pathname = usePathname();

  return (
    <nav className="h-[100px] border-t border-gray1 flex items-center justify-around fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto bg-white">
      <NavItem
        to="/menu"
        defaultIcon={icons.category.default}
        activeIcon={icons.category.active}
        label="카테고리"
        isActive={pathname === "/menu"}
      />
      <NavItem
        to="/board"
        defaultIcon={icons.community.default}
        activeIcon={icons.community.active}
        label="바로파밍"
        isActive={pathname.startsWith("/board")}
      />
      <NavItem
        to="/"
        defaultIcon={icons.home.default}
        activeIcon={icons.home.active}
        label="홈"
        isActive={pathname === "/"}
      />
      <NavItem
        to="/users/mypage"
        defaultIcon={icons.profile.default}
        activeIcon={icons.profile.active}
        label="프로필"
        isActive={pathname === "/users/mypage"}
      />
      <NavItem
        to="/cart"
        defaultIcon={icons.cart.default}
        activeIcon={icons.cart.active}
        label="장바구니"
        isActive={pathname === "/cart"}
      />
    </nav>
  );
}
