import { fetchApi } from "lib/api";
import { ProductDetailType } from "type/product";

export type DetailProps = {
  params: {
    _id: number;
  };
};

// 메타 데이터 설정
// export function generateMetadata({params}: DetailProps) {

// }

export default async function ProductDetail({ params }: DetailProps) {
  // data fetching
  const product: ProductDetailType = await fetchApi(`/products/${params._id}`, {
    next: {
      revalidate: 300,
    },
  });

  return;
}
