"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "lib/api";

type CategoryProps = {
  params: {
    category: string;
  };
};
export default function Category({ params }: CategoryProps) {
  const { category } = params;

  // 카테고리별 데이터 가져오기
  const { data: products } = useQuery({
    queryKey: ["products", category],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("custom", JSON.stringify({ "extra.category": category }));

      const data = await fetchApi(`/products?${params.toString()}`, {
        next: {
          revalidate: 60,
        },
      });
      return data;
    },
  });

  console.log(products);

  return <h1>{category}</h1>;
}
