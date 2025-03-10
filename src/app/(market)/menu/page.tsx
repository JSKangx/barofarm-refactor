"use client";

import { useQueryClient } from "@tanstack/react-query";
import MenuItem from "components/_/MenuItem";
import { getCategoryProducts } from "server-action";

export interface MenuItemProps {
  to: string;
  image: string;
  title: string;
  category: string;
  handleMouseEnter: (category: string) => void;
}
const menuItems: Omit<MenuItemProps, "handleMouseEnter">[] = [
  {
    to: "/menu/fruit",
    image: "/images/menu/Fruit.svg",
    title: "과일",
    category: "fruit",
  },
  {
    to: "/menu/vegetable",
    image: "/images/menu/Vegetable.svg",
    title: "채소",
    category: "vegetable",
  },
  {
    to: "/menu/kimchi",
    image: "/images/menu/Kimchi.svg",
    title: "김치",
    category: "kimchi",
  },
  {
    to: "/menu/liveStock",
    image: "/images/menu/liveStock.svg",
    title: "축산물",
    category: "liveStock",
  },
  {
    to: "/menu/seafood",
    image: "/images/menu/seafood.svg",
    title: "수산물",
    category: "seafood",
  },
  {
    to: "/menu/simple",
    image: "/images/menu/simple.svg",
    title: "간편식",
    category: "simple",
  },
  {
    to: "/menu/riceCake",
    image: "/images/menu/riceCake.svg",
    title: "떡",
    category: "riceCake",
  },
  {
    to: "/menu/rice",
    image: "/images/menu/rice.svg",
    title: "쌀 / 잡곡",
    category: "rice",
  },
];

export default function Menu() {
  // data prefetching
  const queryClient = useQueryClient();
  const handleMouseEnter = (category: string) => {
    // 서버 액션을 사용한 prefetch
    queryClient.prefetchQuery({
      queryKey: ["products", category],
      queryFn: async () => await getCategoryProducts(category),
    });
  };

  return (
    <>
      {menuItems.map((item) => (
        <li key={item.to}>
          <MenuItem
            to={item.to}
            image={item.image}
            title={item.title}
            category={item.category}
            handleMouseEnter={handleMouseEnter}
          />
        </li>
      ))}
    </>
  );
}
