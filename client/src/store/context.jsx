import { createContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { auth, firestore } from "../firebase-config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import axios from "axios";

export const Context = createContext();

const AppContext = (props) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [user, setUser] = useState(null);
  const location = useLocation();
  console.log(cartItems);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  console.log(cartItems)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUser(user);
        syncCartItems(uid); // Sync cart items for the logged-in user
      } else {
        setUser(null);
        setCartItems([]); // Clear cart items when user logs out
      }
    });

    return () => unsubscribe(); // Clean up the subscription
  }, []);

  useEffect(() => {
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.attributes.price * item.attributes.quantity,
      0
    );
    const totalCartCount = cartItems.reduce(
      (acc, item) => acc + item.attributes.quantity,
      0
    );
    setCartCount(totalCartCount);
    setTotalAmount(subtotal);
  }, [cartItems]);

  const handleAddToCart = (product, quantity) => {
    let items = [...cartItems];
    let index = items.findIndex((item) => item.id === product.id);
    if (index !== -1) {
      items[index].attributes.quantity += quantity;
    } else {
      product.attributes.quantity = quantity;
      items = [...items, product];
    }
    console.log(items)
    setCartItems(items);

    if (user) {
      updateFirestoreCart(user.uid, items);
    }
  };

  const handleRemoveFromCart = (product) => {
    let items = [...cartItems];
    items = items.filter((item) => item.id !== product.id);
    setCartItems(items);

    if (user) {
      // If user is logged in, update cart items in Firestore
      updateFirestoreCart(user.uid, items);
    }
  };

  const handleCartProductQuantity = (type, product) => {
    let items = [...cartItems];
    let index = items.findIndex((item) => item.id === product.id);
    if (type === "inc") {
      items[index].attributes.quantity += 1;
    } else if (type === "dec") {
      if (items[index].attributes.quantity === 1) return;
      items[index].attributes.quantity -= 1;
    }
    setCartItems(items);

    if (user) {
      // If user is logged in, update cart items in Firestore
      updateFirestoreCart(user.uid, items);
    }
  };

  const syncCartItems = async (uid) => {
    try {
      const res = await axios(`https://shopping-93dce-default-rtdb.firebaseio.com/${uid}.json`)
      console.log(res.data.items)
      setCartItems(res.data.items)
    } catch (error) {
      console.log(error)
    }
  };

  const updateFirestoreCart = async (uid, items) => {
    try {
      const res = axios.put(`https://shopping-93dce-default-rtdb.firebaseio.com/${uid}.json`, {items})
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out successfully");
      })
      .catch((error) => {
        console.error("Error signing out user: ", error);
      });
  };

  return (
    <Context.Provider
      value={{
        categories,
        setCategories,
        products,
        setProducts,
        cartItems,
        setCartItems,
        cartCount,
        setCartCount,
        totalAmount,
        setTotalAmount,
        user,
        signOut: handleSignOut,
        handleAddToCart,
        handleRemoveFromCart,
        handleCartProductQuantity,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default AppContext;
