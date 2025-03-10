"use server";

import { fetchApi } from "lib/api";
import { ProductsResponse } from "type/product";

export async function getCategoryProducts(category: string) {
  const params = new URLSearchParams();
  params.append("custom", JSON.stringify({ "extra.category": category }));
  const data: ProductsResponse = await fetchApi(
    `/products?${params.toString()}`,
    {
      next: {
        revalidate: 60,
      },
    }
  );
  return data.item;
}
