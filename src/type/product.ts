export interface ProductType {
  active: boolean;
  bookmarks: number;
  buyQuantity: number;
  createdAt: string;
  extra: {
    bestSeason: number[];
    bestMonth?: number[];
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
  myBookmarkId?: number;
}

export interface ProductDetailType {
  _id: number;
  seller_id: number;
  price: number;
  shippingFees: number;
  show: boolean;
  active: boolean;
  name: string;
  quantity: number;
  buyQuantity: number;
  rating?: number;
  mainImages: [
    {
      path: string;
      name: string;
      originalname: string;
    }
  ];
  content: string;
  createdAt: string;
  updatedAt: string;
  extra: {
    isNew: boolean;
    isBest: boolean;
    category: string;
    sort: number;
    rating: number;
    sale: number;
    saledPrice: number;
    bestMonth: number[];
  };
  seller: {
    _id: number;
    email: string;
    name: string;
    phone: string;
    address: string;
    image: string;
    extra: {
      birthday: string;
      membershipClass: string;
      addressBook: {
        id: number;
        name: string;
        value: string;
      }[];
    };
  };
  replies: {
    _id: number;
    user_id: number;
    user: {
      _id: number;
      name: string;
      image: string;
    };
    rating: number;
    content: string;
    createdAt: string;
  }[];
  bookmarks: number;
  options: string[];
  myBookmarkId?: number;
}

export interface Pagination {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface ProductsResponse {
  item: ProductType[];
  pagination: Pagination;
  ok: number;
}

export interface ProductDetailResponse {
  item: ProductDetailType;
  ok: number;
}
