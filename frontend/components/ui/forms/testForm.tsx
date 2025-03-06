"use client";
import { IProduct } from "@/types/products";
import React from "react";
import { useFormStatus } from "react-dom";
import { formSubmitHandler } from "@/actions/productUpdate";

type Tprops = {
  products: IProduct[];
};



export default function TestForm({ products }: Tprops) {

  function Button() {
    const { pending } = useFormStatus();
    return (
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
      >
        {pending ? "Submit..." : "Submit"}
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2 border-2">
      {products.map((product) => (
        <form
        action={formSubmitHandler}
        key={product._id}
        className="flex flex-col gap-2 border-2 p-2 border-cyan-600"
      >
        <input type="hidden" name="_id" defaultValue={product._id} />
        <input type="text" name="name" defaultValue={product.name} />
        <input
          type="text"
          name="description"
          defaultValue={product.description}
        />
        <input type="text" name="price" defaultValue={product.price} />
        <input type="text" name="category" defaultValue={product.category} />
        <input type="text" name="stock" defaultValue={product.stock} />
        <input type="text" name="ratings" defaultValue={product.ratings} />
        <Button/>
      </form>
      ))}
    </div>
  );
}
