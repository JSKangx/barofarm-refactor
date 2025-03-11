"use client";

import { useQuery } from "@tanstack/react-query";
import Products from "components/market/Products";
import Spinner from "components/Spinner";
import { fetchApi } from "lib/api";
import { ProductsResponse } from "type/product";

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
      const params = new URLSearchParams();
      params.append("custom", JSON.stringify({ "extra.category": category }));

      const data: ProductsResponse = await fetchApi(
        `/products?${params.toString()}`,
        {
          next: {
            revalidate: 60,
          },
        }
      );
      return data;
    },
    select: (res) => res.item,
  });

  // 로딩 상태 처리
  if (isLoading) return <Spinner />;

  return <Products productsData={products} />;
}
