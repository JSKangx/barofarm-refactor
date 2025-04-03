import CartClient from "components/_/market/CartClient";
import { fetchApi } from "lib/api";
import { BookmarkRes, CartResponse } from "type/cart";

export default async function Cart() {
  // 장바구니 목록 조회
  const cartRes: CartResponse = await fetchApi("/carts", {
    next: {
      tags: ["carts"],
      revalidate: 60,
    },
  });
  if (!cartRes.item) return null;
  const cartItem = cartRes.item;

  // 찜한 상품 목록 조회
  const bookmarkRes: BookmarkRes = await fetchApi("/bookmarks/product", {
    next: {
      tags: ["bookmarks", "product"],
    },
  });
  if (!bookmarkRes.item) return null;
  const bookmarkItem = bookmarkRes.item;

  return <CartClient data={cartItem} bookmarkItem={bookmarkItem} />;
}
