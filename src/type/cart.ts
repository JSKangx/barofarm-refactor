export interface CartItems {
  _id: number;
  product_id: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: {
    _id: number;
    name: string;
    price: number;
    seller_id: number;
    quantity: number;
    buyQuantity: number;
    image: {
      path: string;
      name: string;
      originalname: string;
    };
    extra: {
      isNew: false;
      isBest: true;
      category: string;
      sort: number;
      rating: number;
      sale: number;
      saledPrice: number;
      bestMonth: number[];
    };
  };
}

export interface CartResponse {
  ok: number;
  item?: CartItems[];
  cost: {
    products: number;
    shippingFees: number;
    discount: { products: number; shippingFees: number };
    total: number;
  };
  message?: string;
  errorName?: string;
}

export interface BookmarkItem {
  _id: number;
  createdAt: string;
  product: {
    _id: number;
    name: string;
    price: number;
    quantity: number;
    buyQuantity: number;
    mainImages: [
      {
        path: string;
        name: string;
        originalname: string;
      }
    ];
    extra: {
      isNew: true;
      isBest: true;
      category: string;
      sort: number;
      rating: number;
      sale: number;
      saledPrice: number;
      bestMonth: number[];
    };
  };
}

export interface BookmarkRes {
  ok: number;
  item: BookmarkItem[];
}

export interface BoomkmarkDelete {
  ok: number;
  message?: string;
  errorName?: string;
}

export interface BookmarkableProduct {
  _id: string;
  myBookmarkId?: number;
  extra: {
    category: string;
  };
}
