"use client";

import { PostType } from "type/board";

interface BoardClientProps {
  posts: PostType[];
}

export default function BoardClient({ posts }: BoardClientProps) {
  console.log(posts);
  return <div>Board Client</div>;
}
