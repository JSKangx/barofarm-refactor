"use client";

import { UseMutationResult, useQuery } from "@tanstack/react-query";
import Checkbox from "components/_/common/Checkbox";
import { clientFetchApi } from "lib/client-api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";
import { CartResponse } from "type/cart";

interface Props {
  _id: number;
  quantity: number;
  register: UseFormRegister<FieldValues>;
  product: {
    _id: number;
    name: string;
    price: number;
    seller_id: number;
    quantity: number;
    buyQuantity: number;
    image: {
      path: string;
    };
    extra: {
      sale: number;
      saledPrice: number;
    };
  };
  deleteItem: UseMutationResult<
    CartResponse | undefined,
    Error,
    number,
    unknown
  >;
  updateItem: UseMutationResult<
    CartResponse,
    Error,
    {
      _id: number;
      quantity: number;
    },
    unknown
  >;
  toggleCartItemCheck: (targetId: number) => void;
  isChecked: boolean;
}

export default function CartItem({
  _id,
  quantity,
  product,
  register,
  deleteItem,
  updateItem,
  toggleCartItemCheck,
  isChecked,
}: Props) {
  // 판매자 이름 상태관리
  const [seller, setSeller] = useState<string | undefined>("");
  const router = useRouter();

  // 타입 정의
  interface UserNameRes {
    ok: number;
    item: {
      name: string;
    };
  }
  // 판매자 id로 이름 fetching
  const { data } = useQuery({
    queryKey: ["users", `${product.seller_id}`, "name"],
    queryFn: async () => {
      const res: UserNameRes = await clientFetchApi(
        `https://11.fesp.shop/users/${product.seller_id}/name`
      );
      return res;
    },
    select: (res) => res.item.name,
  });

  // 판매자 이름 상태 업데이트 (data가 업데이트 될 때 다시 화면 렌더링 필요)
  useEffect(() => {
    setSeller(data);
  }, [data]);

  return (
    <div className="mb-3">
      <div className="py-[10px] border-b border-gray2 text-[14px]">
        {seller}
      </div>
      <div className="pt-[10px] flex gap-3">
        <Checkbox
          name={`${_id}`}
          register={register(`${_id}`)}
          onClick={() => toggleCartItemCheck(_id)}
          checked={isChecked}
        />
        <Image
          width={72}
          height={72}
          src={`https://11.fesp.shop${product.image.path}`}
          alt="상품 이미지"
          className="object-cover cursor-pointer"
          onClick={() => router.push(`/product/${product._id}`)}
        />
        <div>
          <div
            className="cursor-pointer"
            onClick={() => router.push(`/product/${product._id}`)}
          >
            <p className="text-xs mb-1">{product.name}</p>
            <div className="flex items-center mb-2">
              <span className="text-xs font-semibold text-red1 mr-1">{`${product.extra.sale}%`}</span>
              <span className="text-[16px] font-extrabold">
                {product.extra.saledPrice.toLocaleString()}원
              </span>
            </div>
          </div>
          <div className="ring-1 ring-gray2 w-fit flex text-center items-center rounded-sm *:flex *:items-center *:justify-center *:text-sm">
            <button
              className="size-6 border-r border-gray2"
              type="button"
              onClick={() => {
                if (quantity > 1)
                  updateItem.mutate({ _id, quantity: quantity - 1 });
              }}
            >
              -
            </button>
            <div className="px-2">{quantity}</div>
            <button
              className="size-6 border-l border-gray2"
              type="button"
              onClick={() => {
                updateItem.mutate({ _id, quantity: quantity + 1 });
              }}
            >
              +
            </button>
          </div>
        </div>
        <button
          className="self-start ml-auto shrink-0"
          type="button"
          onClick={() => deleteItem.mutate(_id)}
        >
          <Image
            width={24}
            height={24}
            src="/icons/icon_x.svg"
            alt="닫기 버튼"
          />
        </button>
      </div>
    </div>
  );
}
