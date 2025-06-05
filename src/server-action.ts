"use server";

import { fetchApi } from "lib/api";
import { ProductsResponse } from "type/product";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

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

// 북마크 추가시 서버 액션
export async function revalidateProductsCache(category?: string) {
  revalidateTag("products");
  revalidateTag("bookmarks");
  revalidateTag("carts");

  if (category) {
    revalidateTag(category);
  }
}

// 로그아웃시 쿠키를 clear 하기 위한 서버 액션
export async function signOut() {
  cookies().delete("_id");
  cookies().delete("accessToken");
  cookies().delete("refreshToken");

  return { success: true };
}
