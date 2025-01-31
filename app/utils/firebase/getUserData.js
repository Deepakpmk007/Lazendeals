const { auth } = require("../firebase");
import { onAuthStateChanged } from "firebase/auth";

export function getAuthUser(callback) {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      const userProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
      callback(userProfile);
    } else {
      callback(null); // No user is logged in
    }
  });
}
