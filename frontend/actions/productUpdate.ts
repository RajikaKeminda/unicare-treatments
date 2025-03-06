"use server";
import { revalidatePath } from "next/cache";
  
  
export async function formSubmitHandler(formData: FormData) {

  console.log(formData);
    // const id = formData.get("_id");
    // const rawFormData = {
    //   name: formData.get("name"),
    //   description: formData.get("description"),
    //   price: formData.get("price"),
    //   category: formData.get("category"),
    //   stock: formData.get("stock"),
    //   ratings: formData.get("ratings"),
    // };
    // try {
    //   await fetch(`http://localhost:8081/api/products/${id}`, {
    //     method: "PUT",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(rawFormData),
    //   });
    // } catch (error) {
    //   console.error(error);
    // }
    revalidatePath("/new-test");
  }
