import { auth } from "auth";
import Button, { ButtonProps } from "components/_/common/Button";
import { SessionProvider } from "next-auth/react";

export default async function AuthButton({
  children,
  type = "button",
  onClick,
  isBig = false,
  isWhite = false,
}: ButtonProps) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <Button type={type} onClick={onClick} isBig={isBig} isWhite={isWhite}>
        {children}
      </Button>
    </SessionProvider>
  );
}
