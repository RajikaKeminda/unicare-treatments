import TestForm from "@/components/ui/forms/testForm";
import { IProduct } from "@/types/products";

export default async function page() {
  //const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api";
  //const apiresponse = await fetch(`${process.env.API_URL}/products`);

  // const { products } = await fetch(`${apiUrl}/products`).then(
  //   (res) => res.json()
  // );
  const products = [] as IProduct[];

  return <TestForm products={products} />;
}
