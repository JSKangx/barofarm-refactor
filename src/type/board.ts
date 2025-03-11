import { Pagination } from "type/product";

export interface PostType {
  _id: number;
  content: string;
  type: string;
  image: string;
  views: number;
  user: {
    _id: number;
    type: string;
    name: string;
    email: string;
    image: string;
  };
  createdAt: string;
  updatedAt: string;
  seller_id: null | number;
  bookmarks: number;
  repliesCount: number;
  product: {
    image: null | string;
  };
}

export interface PostResponse {
  item: PostType[];
  pagination: Pagination;
  ok: number;
}
