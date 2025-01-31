import { get, ref } from "firebase/database";
import { database } from "../firebase";
export default async function getAllProduct() {
  const productsRef = ref(database, "products");
  const snapshot = await get(productsRef);

  if (snapshot.exists()) {
    const data = snapshot.val();
    // Map Firebase data into an array of objects for easier use in the component
    return Object.entries(data).map(([id, product]) => ({
      id,
      name: product.productName,
      category: product.category,
      description: product.description,
      discount: product.discount,
      price: product.price,
      quantity: product.quantity,
      imageUrl: product.images[0], // Use the first image if multiple are provided
    }));
  } else {
    console.log("No products available");
    return [];
  }
}
