type cetegoryType = {
  title: string;
  image: string;
  url: string;
};
export const categories: cetegoryType[] = [
  { title: "제철 과일", image: "/images/menu/Fruit.svg", url: "/menu/fruit" },
  {
    title: "채소",
    image: "/images/menu/Vegetable.svg",
    url: "/menu/vegetable",
  },
  { title: "김치", image: "/images/menu/Kimchi.svg", url: "/menu/kimchi" },
  {
    title: "축산물",
    image: "/images/menu/Livestock.svg",
    url: "/menu/liveStock",
  },
  { title: "수산물", image: "/images/menu/Seafood.svg", url: "/menu/seafood" },
  { title: "간편식품", image: "/images/menu/Simple.svg", url: "/menu/simple" },
  { title: "떡", image: "/images/menu/Ricecake.svg", url: "/menu/riceCake" },
  { title: "쌀/잡곡", image: "/images/menu/Rice.svg", url: "/menu/rice" },
];
