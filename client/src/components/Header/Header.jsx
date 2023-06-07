import React, { useContext, useEffect, useState } from "react";
import "./Header.scss";
import { TbSearch } from "react-icons/tb";
import { CgShoppingCart } from "react-icons/cg";
import { AiOutlineHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

import Search from "./Search/Search";
import Cart from "../Cart/Cart";
import { Context } from "../../store/context";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase-config";
import { toast } from "react-toastify";

const Header = () => {
  const navigate = useNavigate();
  const { cartCount, user } = useContext(Context);
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 200) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleToggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const goToCategory = () => {
    navigate("/");
    const categorySection = document.getElementById("category-section");
    setTimeout(() => {
      if (categorySection) {
        categorySection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleLogout = () => {
    signOut(auth).then(() => console.log("signout"));
    toast.success("Sign Out successful");
    setShowProfileDropdown(false);
  };

  return (
    <>
      <header className={`main-header ${scrolled ? "sticky-header" : ""}`}>
        <div className="header-content">
          <ul className="left">
            <li onClick={() => navigate("/")}>Home</li>
            <li>About</li>
            <li onClick={goToCategory}>Categories</li>
          </ul>
          <div className="center" onClick={() => navigate("/")}>
            Store
          </div>
          <div className="right">
            <TbSearch onClick={() => setShowSearch(true)} />
            <AiOutlineHeart />
            <span className="cart-icon" onClick={() => setShowCart(true)}>
              <CgShoppingCart />
              {!!cartCount && <span>{cartCount}</span>}
            </span>
            {user ? (
              <div
                className="profile-icon"
                onClick={handleToggleProfileDropdown}
              >
                <img
                  src={
                    user.photoURL &&
                    user.photoURL ||
                      "https://img.freepik.com/free-vector/man-with-mustache_1308-83591.jpg?w=740&t=st=1686061290~exp=1686061890~hmac=597a21eed283198e4361374cbe67730340b709a35e7c4dda51c82a5aeb566395"
                  }
                  alt="User Avatar"
                />
                {showProfileDropdown && (
                  <ul className="profile-dropdown">
                    <li onClick={() => navigate("/profile")}>Profile</li>
                    <li onClick={handleLogout}>Logout</li>
                  </ul>
                )}
              </div>
            ) : (
              <button
                className="login-button"
                onClick={() => navigate("/auth")}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>
      {showCart && <Cart setShowCart={setShowCart} />}
      {showSearch && <Search setShowSearch={setShowSearch} />}
    </>
  );
};

export default Header;
