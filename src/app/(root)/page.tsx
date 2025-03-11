import HomeClient from "components/_/root/HomeClient";
import { fetchApi } from "lib/api";
import { PostResponse } from "type/board";
import { ProductType, ProductsResponse } from "type/product";
import getMonthlyData from "utils/getMonthlyData";

export default async function Home() {
  // 상품 목록 fetching
  const products: ProductsResponse = await fetchApi("/products");
  // 게시글 목록 fetching
  const posts: PostResponse = await fetchApi("/posts?type=community");

  // 데이터 없을시 null 반환하여 에러 방지
  if (!products) return null;

  // 캐러셀을 위한 할인 상품 sorting
  const saleProducts = products.item
    .toSorted((a: ProductType, b: ProductType) => b.extra.sale - a.extra.sale)
    .filter((_, index) => index < 6);

  // 인기 상품 렌더링
  const bestProducts = products.item
    .toSorted((a: ProductType, b: ProductType) => b.buyQuantity - a.buyQuantity)
    // 4개의 상품만 골라서 Product 컴포넌트로 보여준다.
    .filter((_, index) => index < 4);

  // 새상품 렌더링
  const newProducts = getMonthlyData(products)
    // 4개의 상품만 골라서 Product 컴포넌트로 보여준다.
    .filter((_, index) => index < 4);

  // 현재 날짜
  const currentMonth = new Date().getMonth() + 1;
  // 제철 상품 렌더링
  const onMonthProducts = products.item
    .filter((item) => item.extra.bestSeason?.includes(currentMonth))
    .filter((_, index) => index < 6);

  return (
    <HomeClient
      saleProducts={saleProducts}
      bestProducts={bestProducts}
      newProducts={newProducts}
      onMonthProducts={onMonthProducts}
      posts={posts.item}
    />
  );
}
