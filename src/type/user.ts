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

export interface ErrorResponse {
  ok: number;
  message: string;
  errors?: [
    {
      type: string;
      value: string;
      msg: string;
      path: "email" | "password";
      location: string;
    }
  ];
}

export type UserResponseType = {
  ok: number;
  item: UserType;
  status: number;
} & Partial<ErrorResponse>;

export type UserResponseNoToken = {
  ok: number;
  item: UserTypeNoToken;
  status: number;
} & Partial<ErrorResponse>;

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
