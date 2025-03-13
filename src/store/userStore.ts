import { LoginUserType } from "type/user";
import { createStore } from "zustand";

// 타입 정의
export interface UserState {
  user: LoginUserType | null;
  setUser: (user: LoginUserType) => void;
  resetUser: () => void;
}

// 초기 상태 상수
const INITIAL_USER: LoginUserType = {
  _id: "",
  name: "",
  accessToken: "",
  refreshToken: "",
};

// initUser : 런타임에 주입되는 초기 데이터
export const createUserStore = (initUser?: Partial<LoginUserType>) => {
  // userStore 생성
  return createStore<UserState>()((set) => ({
    // null이 아닌 빈 객체로 초기화하거나, 초기값이 제공되면 병합
    user: initUser ? { ...INITIAL_USER, ...initUser } : INITIAL_USER,
    setUser: (user: LoginUserType) => set({ user: user }),
    resetUser: () => set({ user: null }),
  }));
};
