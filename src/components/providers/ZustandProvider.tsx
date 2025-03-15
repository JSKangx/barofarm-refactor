import { useSession } from "next-auth/react";
import React, { createContext, ReactNode, useContext } from "react";
import { createUserStore, UserStore } from "store/userStore";
import { LoginUserType } from "type/user";
import { StoreApi } from "zustand";

// 스토어 인스턴스를 담을 context 생성: 초기값 null
const UserStoreContext = createContext<StoreApi<UserStore> | null>(null);

// UserStore를 사용하기 위한 커스텀 훅
export const useUserStore = () => {
  const store = useContext(UserStoreContext);
  if (!store)
    throw new Error("useUserStore는 UserProvider 내에서만 사용할 수 있습니다.");
  return store;
};

// Context.Provider의 역할을 하는 UserProvider 정의
export const UserProvider = ({ children }: { children: ReactNode }) => {
  // NextAuth 세션에서 사용자 데이터 가져오기
  const { data: session } = useSession();

  // 세션 데이터를 사용하여 스토어 초기화
  // 세션 데이터가 있으면 그것을 LoginUserType 형태로 변환하여 사용
  const sessionUser = session?.user as LoginUserType | undefined;

  // 스토어 생성 (React.useMemo를 사용하여 불필요한 재생성 방지)
  const userStore = React.useMemo(
    () => createUserStore(sessionUser),
    [sessionUser] // sessionUser가 변경될 때마 스토어를 재생성
  );

  return (
    <UserStoreContext.Provider value={userStore}>
      {children}
    </UserStoreContext.Provider>
  );
};
