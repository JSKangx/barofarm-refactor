export default function Home() {
  return (
    <div>
      <Carousel height={225} data={saleProducts} />
      <section className="px-5 mb-4">
        <h2 className="text-xl mb-3">
          관심있는 <span className="font-bold">카테고리</span> 선택하기
        </h2>
        <div className="category-div grid grid-cols-4 gap-y-[6px] gap-x-[14px] text-[14px] *:flex *:flex-col *:text-center">
          {categoryIcons}
        </div>
      </section>
      <section className="px-5 mb-4">
        <div className="flex justify-between mb-3">
          <h2 className="text-xl">
            지금 최고 <span className="font-bold">인기 상품! 🔥</span>
          </h2>
          <Link
            to={"/search/best"}
            className="text-xs flex gap-1 items-start cursor-pointer"
          >
            더보기
            <img
              src="/icons/icon_move.svg"
              alt="더보기 버튼"
              className="size-4"
            />
          </Link>
        </div>
        <div className="grid grid-cols-2 justify-between gap-5">
          {bestProducts}
        </div>
      </section>
      <section className="px-5 mb-4">
        <div className="flex justify-between mb-3">
          <h2 className="text-xl">
            따끈따끈한 <span className="font-bold">신상품! ⏰</span>
          </h2>
          <Link
            to={"/search/new"}
            className="text-xs flex gap-1 items-start cursor-pointer"
          >
            더보기
            <img
              src="/icons/icon_move.svg"
              alt="더보기 버튼"
              className="size-4"
            />
          </Link>
        </div>
        <div className="grid grid-cols-2 justify-between gap-5">
          {newProducts}
        </div>
      </section>
      <section className="px-5 mb-4">
        <div className="flex justify-between">
          <h2 className="text-xl">
            이 맛이야! <span className="font-bold">제철 음식 🍂</span>
          </h2>
          <Link
            to={"/search/seasonal"}
            className="text-xs flex gap-1 items-start cursor-pointer"
          >
            더보기
            <img
              src="/icons/icon_move.svg"
              alt="더보기 버튼"
              className="size-4"
            />
          </Link>
        </div>
        <div className="flex overflow-x-auto gap-3">{onMonthProducts}</div>
      </section>
      <section className="mb-4">
        <div className="flex justify-between px-5 mb-4">
          <h2 className="text-xl">
            나만의 <span className="font-bold">요리 스토리 🥘</span>
          </h2>
          <div className="flex gap-1 items-start relative *:relative *:top-1">
            <Link to="/board" className="text-xs">
              커뮤니티 가기
            </Link>
            <button>
              <img
                src="/icons/icon_move.svg"
                alt="더보기 버튼"
                className="size-4"
              />
            </button>
          </div>
        </div>
        {storyImages}
      </section>
      <section className="flex flex-col gap-1 px-5 bg-gray1 text-black text-sm py-5 text-center">
        <p className="font-semibold">(주) 바로팜 사업자 정보</p>
        <p>
          (주)바로팜 | 대표자 : 바로팜 <br />
          사업자 등록번호 : 023-25-59672 <br />
          주소 : 서울 강남구 옆집의 옆집 234로 무천타워 2층 <br />
          대표번호 : 1588-1028 <br />
          메일 : baroFarm@baroFarm.co.kr
        </p>
        <p className="font-semibold">고객센터 1800-1800</p>
        <p className="mb-[58px]">
          누구보다 빠르게 남들과는 다르게 상담해 드립니다.
        </p>
        <p>이용약관 | 개인정보처리방침 | 게시글 수집 및 이용 안내</p>
      </section>
    </div>
  );
}
