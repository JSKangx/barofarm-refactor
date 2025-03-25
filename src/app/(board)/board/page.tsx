import BoardClient from "components/_/board/BoardClient";
import { fetchApi } from "lib/api";
import { Metadata } from "next";
import { PostResponse } from "type/board";

export const metadata: Metadata = {
  title: "바로파밍",
  description:
    "바로파밍은 모든 회원이 함께하는 소통 공간입니다. 바로팜에서 구매한 상품으로 만든 요리를 자랑하고 나만의 레시피를 나누어 보세요!",
};

export default async function Board() {
  // 게시물 데이터 fetching
  const res: PostResponse = await fetchApi("/posts?type=community");
  const posts = res.item;

  return <BoardClient posts={posts} />;
}
