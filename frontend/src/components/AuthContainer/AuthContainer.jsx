import React, { useState } from "react";
import Login from "../../pages/Login/Login";
import Signup from "../../pages/SignUp/Signup";

const AuthContainer = () => {
  // This state determines which component to show
  const [isLogin, setIsLogin] = useState(true);

  // Functions to switch between components
  const switchToSignup = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);

  // Renders either Login or Signup based on isLogin state
  return (
    <>
      {isLogin ? (
        <Login switchToSignup={switchToSignup} />
      ) : (
        <Signup switchToLogin={switchToLogin} />
      )}
    </>
  );
};

export default AuthContainer;
