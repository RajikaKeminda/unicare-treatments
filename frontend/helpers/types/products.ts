export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  ratings: number;
  reviews: number;
}
