export interface Product {
  active: boolean;
  bookmarks: number;
  buyQuantity: number;
  createdAt: string;
  extra: {
    bestSeason: number[];
    category: string;
    depth: number;
    isBest: boolean;
    isNew: boolean;
    rating: number;
    sale: number;
    saledPrice: number;
    sort: number;
  };
  mainImages: {
    name: string;
    originalname: string;
    path: string;
  }[];
  name: string;
  options: number;
  price: number;
  quantity: number;
  replies: number;
  rating?: number;
  seller: {
    address: string;
    bookmark: {
      posts: number;
      products: number;
      users: number;
    };
    bookmarkedBy: {
      users: number;
    };
    email: string;
    extra: {
      addressBook: {
        id: number;
        name: string;
        values: string;
      }[];
      birthday: string;
      confirm: boolean;
      merbershipClass: string;
    };
    image: string;
    name: string;
    phone: string;
    _id: number;
  };
  seller_id: number;
  shippingFees: number;
  show: boolean;
  updatedAt: string;
  _id: number;
}

export interface Pagination {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface ProductsResponse {
  item: Product[];
  pagination: Pagination;
  ok: number;
}
