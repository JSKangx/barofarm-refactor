import Image from "next/image";
import Link from "next/link";

interface Props {
  keyword: string;
  onRemove: (keywordToRemove: string) => void;
}

export default function RecentKeywordItem({ keyword, onRemove }: Props) {
  return (
    <li className="rounded-full border border-btn-primary text-btn-primary flex items-center gap-1 px-2">
      <Link
        href={`/search/results?keyword=${keyword}`}
        className="hover:font-bold"
      >
        {keyword}
      </Link>
      <button aria-label="검색어 삭제" onClick={() => onRemove(keyword)}>
        <Image
          width={18}
          height={18}
          src="/icons/icon_x_green.svg"
          alt="삭제"
        />
      </button>
    </li>
  );
}
