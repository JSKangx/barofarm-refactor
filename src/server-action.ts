"use server";

import { fetchApi } from "lib/api";
import { ProductsResponse } from "type/product";
import { signIn as _signIn, signOut as _signOut } from "auth";
import { revalidateTag } from "next/cache";

// 카테고리별 상품 목록 가져오기
export async function getProducts(category: string) {
  const data: ProductsResponse = await fetchApi(
    `/products?category=${category}`,
    {
      next: {
        tags: ["products", category],
        revalidate: 300,
      },
    }
  );
  return data;
}

// products 쿼리 키를 가진 데이터 캐시를 무효화하는 함수
export async function revalidateProductsCache(category?: string) {
  revalidateTag("products");

  if (category) {
    revalidateTag(category);
  }
}

// NextAuth의 로직을 클라이언트에서 사용하도록 함수 래핑
export async function signIn() {
  await _signIn;
}

export async function singOut() {
  await _signOut;
}
