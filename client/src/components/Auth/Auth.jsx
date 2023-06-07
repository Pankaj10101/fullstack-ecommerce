import React, { useState } from "react";
import "./Auth.css";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
} from "firebase/auth";
import { auth, provider } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(
    false
  );
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  const handleEmailAuth = () => {
    if (isSignUp) {
      if (!email || !password || !confirmPassword) {
        toast.error("Please fill in all the fields.");
      } else if (password !== confirmPassword) {
        toast.error("Password and Confirm Password do not match.");
      } else {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            console.log("Signing up with email and password...");
            setIsSignUp(!isSignUp);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage);
          });
      }
    } else {
      if (!email || !password) {
        toast.error("Please fill in all the fields.");
      } else {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            navigate("/");
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            if (errorCode === "auth/user-not-found") {
              toast.error("User does not exist. Please sign up.");
            } else {
              toast.error(errorMessage);
            }
          });
      }
    }
  };

  const handleGoogleAuth = () => {
    signInWithPopup(auth, provider).then(() => {
      navigate('/')
    });
  };

  const handleForgotPassword = () => {
    setShowForgotPasswordModal(true);
  };

  const handleForgotPasswordEmailChange = (e) => {
    setForgotPasswordEmail(e.target.value);
  };

  const handleSendPasswordResetEmail = () => {
    if (!forgotPasswordEmail) {
      toast.error("Please enter your email.");
    } else {
      sendPasswordResetEmail(auth, forgotPasswordEmail)
        .then(() => {
          toast.success("Password reset email sent. Please check your email.");
          setShowForgotPasswordModal(false);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorCode === "auth/user-not-found") {
            toast.error("User does not exist. Please sign up.");
          } else {
            toast.error(errorMessage);
          }
        });
    }
  };

  return (
    <div className="container">
      <div className="auth-container">
        <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
        <div className="social-login">
          <button onClick={handleGoogleAuth}>Sign In with Google</button>
        </div>
        <div className="input-group">
          <label>Email:</label>
          <input type="email" value={email} onChange={handleEmailChange} />
        </div>
        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        {isSignUp && (
          <div className="input-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
          </div>
        )}
        <div className="button-group">
          <button onClick={handleEmailAuth}>
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
          <div className="toggle-mode" onClick={handleToggleMode}>
            {isSignUp ? (
              <span>Already have an account? Sign In</span>
            ) : (
              <span>Create an account? Sign Up</span>
            )}
          </div>
          <div className="forgot-password" onClick={handleForgotPassword}>
            <span>Forgot Password?</span>
          </div>
        </div>
      </div>
      {showForgotPasswordModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Forgot Password</h2>
            <div className="input-group">
              <label>Email:</label>
              <input
                type="email"
                value={forgotPasswordEmail}
                onChange={handleForgotPasswordEmailChange}
              />
            </div>
            <button onClick={handleSendPasswordResetEmail}>
              Send Reset Email
            </button>
            <button onClick={() => setShowForgotPasswordModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
