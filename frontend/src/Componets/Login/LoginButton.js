import React from "react";
import "./Login.scss";

const LoginButton = () => {
  const handleLogin = (e) => {};

  return (
    <div>
      <div>
        <button type="submit" class="btn btn-primary" onClick={handleLogin}>
          Sign In
        </button>
      </div>
      <div>
        <button type="submit" class="btn btn-primary" onClick={handleLogin}>
          Register
        </button>
      </div>
    </div>
  );
};

export default LoginButton;
