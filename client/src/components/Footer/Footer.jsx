import React from "react";
import "./Footer.scss";
import { FaLocationArrow, FaMobileAlt, FaEnvelope } from "react-icons/fa";
import Payment from "../../assets/payments.png";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="col">
          <div className="title">About</div>
          <div className="text">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Neque,
            perspiciatis! Numquam aperiam consectetur odit reiciendis similique
            vitae, vero rem odio optio enim eveniet vel dicta sit nostrum
            maiores. Delectus, voluptate!
          </div>
        </div>
        <div className="col">
          <div className="title">Contact</div>
          <div className="c-item">
            <FaLocationArrow/>
            <div className="text">
              Kharar, Punjab, 140301
            </div>
          </div>
          <div className="c-item">
            <FaMobileAlt/>
            <div className="text">
              Phone : 7589057633
            </div>
          </div>
          <div className="c-item">
            <FaEnvelope/>
            <div className="text">
              Email : rkay1048@gmail.com
            </div>
          </div>
        </div>
        <div className="col">
          <div className="title">Categories</div>
          <div className="text">Headphones</div>
          <div className="text">Smart Watches</div>
          <div className="text">Speaker</div>
          <div className="text">Smartphones</div>
        </div>
        <div className="col">
          <div className="title">Pages</div>
          <div className="text">Home</div>
          <div className="text">About</div>
          <div className="text">Terms & Conditions</div>
          <div className="text">Contact Us</div>
        </div>
      </div>
      <div className="bottom-bar">
        <div className="bottom-bar-content">
          <div className="text">
          @rightsreserved
          </div>
          <img src={Payment} alt="payment" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
