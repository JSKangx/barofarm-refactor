export interface UserType {
  _id: number;
  name: string;
  email: string;
  type: string;
  loginType: string;
  createdAt: string;
  updatedAt: string;
  image: string;
  address: string;
  bookmark: {
    products: number;
    users: number;
    posts: number;
  };
  bookmarkedBy: {
    users: number;
  };
  extra: {
    addressBook: [];
    birth: string;
    gender: string;
    userName: string;
  };
  phone?: string;
  postViews?: number;
  posts?: number;
  notifications: [];
  token: {
    accessToken: string;
    refreshToken: string;
  };
}

export type UserTypeNoToken = Omit<UserType, "token">;

export interface UserResponseType {
  ok: number;
  item: UserType;
}

export type UserResponseNoToken = {
  ok: number;
  item: UserTypeNoToken;
};

// optional 프로퍼티는 유저 입력 선택사항
export interface LoginUserType {
  _id: number;
  name: string;
  email?: string;
  type: string;
  image?: string;
  address?: string;
  phone?: string;
}
