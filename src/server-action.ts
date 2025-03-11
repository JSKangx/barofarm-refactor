"use server";

import { fetchApi } from "lib/api";
import { ProductsResponse } from "type/product";

// 상품 정보 가져오기. category 매개변수가 있으면 검색 카테고리에 해당하는 상품만 가져오고, 아니면 모든 상품 가져옴.
export async function getProducts(category?: string) {
  const params = new URLSearchParams();
  params.append("custom", JSON.stringify({ "extra.category": category }));
  // category 매개변수에 따라 request url 다르게 설정
  const url = category ? `/products?${params.toString()}` : "/products";
  const data: ProductsResponse = await fetchApi(url, {
    next: {
      revalidate: 300,
    },
  });
  return data;
}
