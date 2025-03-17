"use client";

import { fetchApi } from "lib/api";
import { useEffect } from "react";
import { useUserStore } from "store/userStore";
import { UserResponseType } from "type/user";

interface Props {
  userId: string | number;
}

export default function UserDataLoader({ userId }: Props) {
  const setUser = useUserStore((state) => state.setUser);

  // 컴포넌트 마운트 후, 유저 데이터를 세션에서 가져와 유저 스토어 업데이트
  useEffect(() => {
    async function loadUserData() {
      try {
        const res: UserResponseType = await fetchApi(`/users/${userId}`);
        const userData = res.item;
        setUser({
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          type: userData.type,
          image: userData.image,
          address: userData.address,
          phone: userData.phone,
        });
      } catch (error) {
        console.error("사용자 정보 로드 실패", error);
      }
    }

    if (userId) {
      loadUserData();
    }
  }, [userId, setUser]);

  return null;
}
