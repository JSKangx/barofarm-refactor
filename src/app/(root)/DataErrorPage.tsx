import Image from "next/image";
import { useRouter } from "next/navigation";

export default function DataErrorPage() {
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen absolute top-0 left-1/2 -translate-x-1/2">
        <h1 className="text-btn-primary font-semibold text-5xl">
          Server Error
        </h1>
        <p className="text-gray5 text-center pt-4">
          서버에서 예상치 못한 오류가 발생했습니다. <br />
          잠시 후 다시 시도해 주세요.
        </p>
        <Image
          src="/images/BaroFarmIcon.png"
          width={0}
          height={0}
          className="w-[300px]"
          alt="BaroFarmIcon"
        />
        <button
          className="text-white  bg-btn-primary px-6 py-2 rounded-md"
          onClick={() => router.push(`/`)}
        >
          메인으로
        </button>
      </div>
    </>
  );
}
