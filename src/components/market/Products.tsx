import Product from "../_/market/Product";
import { ProductType } from "type/product";

export default function Products({
  productsData,
}: {
  productsData: ProductType[] | undefined;
}) {
  return (
    <div className="grid grid-cols-2 justify-between p-5 gap-5">
      {productsData?.map((product) => (
        <Product key={product._id} {...product} />
      ))}
    </div>
  );
}
