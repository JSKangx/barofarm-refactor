import { fetchApi } from "lib/api";

export type DetailProps = {
  params: {
    _id: number;
  };
};

export default async function ProductDetail({ params }: DetailProps) {
  const product = await fetchApi(`/products/${params._id}`, {
    next: {
      revalidate: 300,
    },
  });
  return;
}
