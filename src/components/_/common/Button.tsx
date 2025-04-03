"use client";

import clsx from "clsx";

export interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset" | undefined;
  onClick?: () => void;
  color?: string;
  isBig?: boolean;
  isWhite?: boolean;
}

export default function Button({
  children,
  type = "button",
  onClick,
  isBig = false,
  isWhite = false,
}: ButtonProps) {
  // 버튼의 스타일을 다르게 하기 위한 클래스 동적 설정
  const baseClasses =
    "flex items-center justify-center rounded-md shrink-0 self-start";
  const styleClasses = isWhite
    ? "border border-gray2 bg-white"
    : "text-white bg-btn-primary";
  const sizeClasses = isBig
    ? "w-full py-3 text-xl font-bold"
    : "py-1 px-3 text-sm font-semibold";

  const classes = clsx(baseClasses, styleClasses, sizeClasses);

  return (
    <button className={classes} type={type} onClick={onClick}>
      {children}
    </button>
  );
}
