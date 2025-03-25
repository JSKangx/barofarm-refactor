import ClientCategory from "components/_/market/CategoryClient";

const categoryTitle = [
  { key: "fruit", label: "과일" },
  { key: "vegetable", label: "채소" },
  { key: "kimchi", label: "김치" },
  { key: "liveStock", label: "축산물" },
  { key: "seafood", label: "수산물" },
  { key: "simple", label: "간편식" },
  { key: "riceCake", label: "떡" },
  { key: "rice", label: "쌀 / 잡곡" },
];

type Props = {
  params: {
    category: string;
  };
};
export function generateMetadata({ params }: Props) {
  const categoryLabel =
    categoryTitle.find((item) => item.key === params.category)?.label ||
    "카테고리";
  return {
    title: `${categoryLabel}`,
    description: `바로Farm ${categoryLabel} 카테고리 페이지입니다.`,
  };
}

export default function Category({ params }: Props) {
  return <ClientCategory params={params} />;
}
