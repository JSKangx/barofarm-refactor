"use client";

import { useQuery } from "@tanstack/react-query";
import Products from "components/market/Products";
import Spinner from "components/Spinner";
import { getProducts } from "server-action";

type CategoryProps = {
  params: {
    category: string;
  };
};
export default function ClientCategory({ params }: CategoryProps) {
  const { category } = params;

  // 카테고리별 상품 목록 가져오기
  const { data: products, isLoading } = useQuery({
    queryKey: ["products", category],
    queryFn: async () => {
      const res = await getProducts(category);
      return res;
    },
    select: (res) => res.item,
  });

  // 로딩 상태 처리
  if (isLoading) return <Spinner />;

  return <Products productsData={products} />;
}
