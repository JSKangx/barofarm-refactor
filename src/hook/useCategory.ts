import { useQuery } from "@tanstack/react-query";
import { clientFetchApi } from "lib/client-api";
import { ProductDetailResponse } from "type/product";

type Code = {
  sort: number;
  code: string;
  value: string;
  depth: number;
};

export const useCategory = (productId: string | string[]) => {
  const { data: categoryData } = useQuery({
    queryKey: ["codes", "productCategory"],
    queryFn: async () => {
      const response = await clientFetchApi(`/codes/productCategory`);
      return response.item;
    },
  });

  const { data: product } = useQuery({
    queryKey: ["products", `${productId}`],
    queryFn: async () => {
      const response: ProductDetailResponse = await clientFetchApi(
        `/products/${productId}`
      );
      return response.item;
    },
    enabled: !!productId,
  });

  const category = categoryData?.productCategory?.codes?.find(
    (item: Code) => item.code === product?.extra.category
  );

  return category?.value;
};
