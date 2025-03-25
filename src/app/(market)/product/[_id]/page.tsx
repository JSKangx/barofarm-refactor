import ProductDetailClient from "components/_/market/ProductDetailClient";
import { fetchApi } from "lib/api";
import { ProductDetailResponse } from "type/product";

export type DetailProps = {
  params: {
    _id: string;
  };
};

// 메타 데이터 설정
export async function generateMetadata({ params }: DetailProps) {
  // data fetching
  const product: ProductDetailResponse = await fetchApi(
    `/products/${params._id}`,
    {
      next: {
        revalidate: 300,
        tags: ["products", params._id],
      },
    }
  );

  return {
    title: product.item.name,
  };
}

export default async function ProductDetail({ params }: DetailProps) {
  // data fetching
  const product: ProductDetailResponse = await fetchApi(
    `/products/${params._id}`,
    {
      next: {
        revalidate: 300,
        tags: ["products", params._id],
      },
    }
  );

  return <ProductDetailClient product={product.item} params={params} />;
}
