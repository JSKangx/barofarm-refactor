"use client";

type CategoryProps = {
  params: {
    category: string;
  };
};
export default function Category({ params }: CategoryProps) {
  const { category } = params;

  // 카테고리별 데이터 가져오기

  return <h1>{category}</h1>;
}
