"use client";

import MenuItem from "components/_/MenuItem";

export interface MenuItemProps {
  to: string;
  image: string;
  title: string;
}
const menuItems: MenuItemProps[] = [
  {
    to: "/menu/fruit",
    image: "/images/menu/Fruit.svg",
    title: "과일",
  },
  {
    to: "/menu/vegetable",
    image: "/images/menu/Vegetable.svg",
    title: "채소",
  },
  {
    to: "/menu/kimchi",
    image: "/images/menu/Kimchi.svg",
    title: "김치",
  },
  {
    to: "/menu/liveStock",
    image: "/images/menu/liveStock.svg",
    title: "축산물",
  },
  {
    to: "/menu/seafood",
    image: "/images/menu/seafood.svg",
    title: "수산물",
  },
  {
    to: "/menu/simple",
    image: "/images/menu/simple.svg",
    title: "간편식",
  },
  {
    to: "/menu/riceCake",
    image: "/images/menu/riceCake.svg",
    title: "떡",
  },
  {
    to: "/menu/rice",
    image: "/images/menu/rice.svg",
    title: "쌀 / 잡곡",
  },
];

export default function Menu() {
  return (
    <>
      {menuItems.map((item) => (
        <li key={item.to}>
          <MenuItem to={item.to} image={item.image} title={item.title} />
        </li>
      ))}
    </>
  );
}
