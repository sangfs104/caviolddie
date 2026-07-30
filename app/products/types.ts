export interface ApiVariant {
  _id: string;
  size: string;
  color: string;
  price: number;
  discountPrice: number | null;
  stock: number;
  image: string;
}

export interface ApiProduct {
  _id: string;
  name: string;
  images: string[];
  description: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  variants: ApiVariant[];
}