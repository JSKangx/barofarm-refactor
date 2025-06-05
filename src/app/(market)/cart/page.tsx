import CartClient from "components/_/market/cart/CartClient";
import { fetchApi } from "lib/api";
import { BookmarkRes, CartResponse } from "type/cart";

export default async function Cart() {
  // 장바구니 목록 조회
  const cartRes: CartResponse = await fetchApi("/carts", {
    next: {
      tags: ["carts"],
      revalidate: 60, // 캐시 타임도 설정 가능
    },
  });
  if (!cartRes.item) return null;
  const cartItem = cartRes;

  // 찜한 상품 목록 조회
  const bookmarkRes: BookmarkRes = await fetchApi("/bookmarks/product", {
    next: {
      tags: ["bookmarks", "product"],
    },
  });
  if (!bookmarkRes.item) return null;
  const bookmarkItem = bookmarkRes;

  return <CartClient initialCart={cartItem} initialBookmarks={bookmarkItem} />;
}
