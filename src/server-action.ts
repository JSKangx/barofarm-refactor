"use server";

import { fetchApi } from "lib/api";
import { ProductsResponse } from "type/product";
import { signIn as _signIn, signOut as _signOut } from "auth";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

const accessToken = cookies().get("accessToken")?.value;

// 상품 정보 가져오기. category 매개변수가 있으면 검색 카테고리에 해당하는 상품만 가져오고, 아니면 모든 상품 가져옴.
export async function getProducts(category?: string) {
  const params = new URLSearchParams();
  params.append("custom", JSON.stringify({ "extra.category": category }));
  // category 매개변수에 따라 request url 다르게 설정
  const url = category ? `/products?${params.toString()}` : "/products";
  const data: ProductsResponse = await fetchApi(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    next: {
      tags: category ? ["products", category] : ["products"],
      revalidate: 300,
    },
  });
  return data;
}

// 북마크 추가 (쿠키에 담긴 토큰을 사용하기 위해 서버액션으로 정의)
export async function addBookmark(productId: number) {
  try {
    const res = await fetchApi("/bookmarks/product", {
      method: "POST",
      body: JSON.stringify({
        target_id: productId,
      }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Next.js 캐시 무효화
    revalidateTag("products");
    console.log(res);
    return res.data;
  } catch (e) {
    console.error(e);
  }
}

// 북마크 해제
export async function removeBookmark(productId: number) {
  try {
    const res = await fetchApi(`/bookmarks/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    // Next.js 캐시 무효화
    revalidateTag("products");
    console.log(res);
    return res.data;
  } catch (e) {
    console.error(e);
  }
}

// NextAuth의 로직을 클라이언트에서 사용하도록 함수 래핑
export async function signIn() {
  await _signIn;
}

export async function singOut() {
  await _signOut;
}
