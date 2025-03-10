import { MenuItemProps } from "app/(market)/menu/page";
import Image from "next/image";
import Link from "next/link";

export default function MenuItem({
  to,
  image,
  title,
  category,
  handleMouseEnter,
}: MenuItemProps) {
  return (
    <Link
      href={to}
      className="flex items-center justify-between border-b-[1px] p-5"
      onMouseEnter={() => handleMouseEnter(category)}
    >
      <span className="flex items-center gap-2">
        <Image
          src={image}
          width={40}
          height={40}
          className="w-10 rounded-full"
          alt={`${title} category`}
        />
        <span>{title}</span>
      </span>
      <Image
        src="/icons/icon_forward_thin.svg"
        width={12}
        height={24}
        alt={`${title} 카테고리로 이동하기`}
      />
    </Link>
  );
}
