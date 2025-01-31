import { ref, get } from "firebase/database";
import { database } from "../firebase";

export default async function getProductById(productId) {
  try {
    const productRef = ref(database, `products/${productId}`);
    const snapshot = await get(productRef);

    if (snapshot.exists()) {
      return { id: productId, ...snapshot.val() }; // Include the product ID with its data
    } else {
      console.log(`No product found with ID: ${productId}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching product data:", error);
    throw error; // Rethrow error for handling in calling code
  }
}
