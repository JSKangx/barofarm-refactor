import ProductDetailClient from "components/_/market/ProductDetailClient";
import { clientFetchApi } from "lib/client-api";
import { ProductDetailResponse } from "type/product";

export type DetailProps = {
  params: {
    _id: string;
  };
};

// 메타 데이터 설정
// export function generateMetadata({params}: DetailProps) {

// }

export default async function ProductDetail({ params }: DetailProps) {
  // data fetching
  const product: ProductDetailResponse = await clientFetchApi(
    `/products/${params._id}`,
    {
      next: {
        revalidate: 300,
      },
    }
  );

  return <ProductDetailClient product={product.item} params={params} />;
}
