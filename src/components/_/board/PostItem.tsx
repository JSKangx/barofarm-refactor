"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { PostType } from "type/board";
import calculateRelativeTime from "utils/calculateRelativeTime";

interface Props {
  post: PostType;
}

export default function PostItem({ post }: Props) {
  const containerRef = useRef(null);
  const [isOverflow, setIsOverflow] = useState(false);
  const checkOverflow = () => {
    if (containerRef.current) {
      const { scrollHeight, clientHeight } = containerRef.current;
      setIsOverflow(scrollHeight > clientHeight); // 높이 비교
    }
  };
  useEffect(() => {
    checkOverflow();
  }, []);

  const newDate = calculateRelativeTime(post.createdAt);

  return (
    <div className="relative">
      <Link href={`/board/${post._id}`}>
        <div
          ref={containerRef}
          className="max-h-[550px] overflow-hidden relative"
        >
          <div className="flex flex-row mt-5 items-center">
            <div className="relative w-6 h-6">
              <Image
                src={
                  post.user.image
                    ? post.user.image.includes("http://") ||
                      post.user.image.includes("https://")
                      ? post.user.image
                      : `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${post.user.image}`
                    : "/images/profile/ProfileImage_Sample.jpg"
                }
                fill
                sizes="100%"
                alt="ProfileImage"
                className="rounded-full object-cover"
              />
            </div>
            <span className="mx-[5px] text-sm">{post.user.name}</span>

            <span className="ml-auto text-xs self-start">
              댓글 {post.repliesCount}개
            </span>
          </div>
          <div className="mx-[5px] mt-[30px]">
            {post.content.split("<br/>").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </div>
          <div className="mt-10">
            {post.image && (
              <div className="relative w-full h-[550px]">
                <Image
                  alt="게시글 이미지"
                  fill
                  sizes="100%"
                  className="relative rounded-md object-cover"
                  src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${post.image}`}
                  onLoad={() => checkOverflow()}
                />
              </div>
            )}
            {isOverflow && (
              <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
            )}
          </div>
        </div>
        <span className="text-[10px] text-gray4 text-left mb-5 block">
          {newDate}
        </span>
      </Link>
      <div className="h-[7px] bg-gray1 -mx-5"></div>
    </div>
  );
}
