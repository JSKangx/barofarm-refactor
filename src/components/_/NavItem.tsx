import Image from "next/image";
import Link from "next/link";

interface NavItemProps {
  to: string;
  defaultIcon: string;
  activeIcon: string;
  label: string;
  isActive: boolean;
}

export default function NavItem({
  to,
  defaultIcon,
  activeIcon,
  label,
  isActive,
}: NavItemProps) {
  return (
    <Link href={to} className="flex flex-col items-center" aria-current="page">
      <Image
        src={isActive ? activeIcon : defaultIcon}
        width={40}
        height={40}
        alt={`${label}icon`}
        className="size-10"
      />
      <span>{label}</span>
    </Link>
  );
}
