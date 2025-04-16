import { Dispatch, SetStateAction } from "react";
import { BookmarkItem } from "type/cart";

interface Props {
  isCartView: boolean;
  setIsCartView: Dispatch<SetStateAction<boolean>>;
  itemList: JSX.Element[] | undefined;
  bookmarkItem: BookmarkItem[] | undefined;
}

export default function CartHeader({
  isCartView,
  setIsCartView,
  itemList,
  bookmarkItem,
}: Props) {
  return (
    <section className="flex h-9 font-semibold border-b border-gray2 *:flex *:grow *:cursor-pointer *:self-stretch *:items-center *:justify-center">
      <div
        className={`${
          isCartView ? "border-b-2 border-btn-primary" : "text-gray3"
        }`}
        onClick={() => setIsCartView(true)}
      >
        담은 상품({itemList?.length})
      </div>
      <div
        className={`${
          isCartView ? "text-gray3 " : "border-b-2 border-btn-primary"
        }`}
        onClick={() => setIsCartView(false)}
      >
        찜한 상품({bookmarkItem?.length})
      </div>
    </section>
  );
}
