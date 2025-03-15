import { LoginUserType } from "type/user";
import { create } from "zustand";

// 타입 정의
export interface UserStore {
  user: LoginUserType | null;
  setUser: (user: LoginUserType) => void;
  resetUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  resetUser: () => set({ user: null }),
}));
