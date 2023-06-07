import React, { useContext, useState } from "react";
import "./Cart.scss";
import { MdClose } from "react-icons/md";
import { BsCartX } from "react-icons/bs";

import CartItem from "./CartItem/CartItem";
import { Context } from "../../store/context";

import { loadStripe } from "@stripe/stripe-js";
import { makePaymentRequest } from "../../store/api";
import { useNavigate } from "react-router-dom";
import { Modal, TextField, Button } from "@mui/material";

const Cart = ({ setShowCart }) => {
  const navigate = useNavigate();
  const { totalAmount, cartItems, user } = useContext(Context);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValidationError, setIsValidationError] = useState(false);

  const stripePromise = loadStripe(
    process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
  );

  const handlePayment = async () => {
    if (user) {
      if (!name || !address || !phoneNumber) {
        setIsValidationError(true);
        return;
      }

      try {
        const stripe = await stripePromise;
        const res = await makePaymentRequest.post("/api/orders", {
          products: cartItems,
          name,
          address,
          phoneNumber,
        });
        await stripe.redirectToCheckout({
          sessionId: res.data.stripeSession.id,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate("/auth");
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setIsValidationError(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="cart-panel">
      <div className="opac-layer"></div>
      <div className="cart-content">
        <div className="cart-header">
          <span className="heading">Shopping Cart</span>
          <span className="close-btn" onClick={() => setShowCart(false)}>
            <MdClose />
            <span className="text">Close</span>
          </span>
        </div>

        {!cartItems?.length && (
          <div className="empty-cart">
            <BsCartX />
            <span>No products in the cart.</span>
            <button className="return-cta">RETURN TO SHOP</button>
          </div>
        )}

        {!!cartItems.length && (
          <>
            <CartItem />
            <div className="cart-footer">
              <div className="subtotal">
                <span className="text">Subtotal :</span>
                <span className="text total">&#8377;{totalAmount}</span>
              </div>
              <div className="button">
                <button className="checkout-cta" onClick={handleOpenModal}>
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <div
          className={`modal ${isValidationError ? "vibrate" : ""}`}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <div className="modal-header"></div>
          <div className="modal-content">
            <div className="modal-close">
              <span onClick={handleCloseModal}>
                <MdClose />
              </span>
            </div>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Address"
              variant="outlined"
              fullWidth
              margin="normal"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              margin="normal"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            {isValidationError && (
              <span className="validation-error">
                Please fill in all the fields.
              </span>
            )}
          </div>
          <div className="modal-footer">
            <Button variant="contained" color="primary" onClick={handlePayment}>
              Proceed to Payment
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Cart;
