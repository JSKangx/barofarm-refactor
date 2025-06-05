import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

interface RevalidateRequestBody {
  tags: string[];
}

export async function POST(request: Request) {
  // revalidate를 위한 POST 요청 처리
  const { tags } = (await request.json()) as RevalidateRequestBody;

  // tags가 배열인지 확인하고, 각 태그에 대해 revalidateTag 호출
  if (Array.isArray(tags)) {
    tags.forEach((tag) => revalidateTag(tag));
  }

  return NextResponse.json({ revalidated: true });
}
