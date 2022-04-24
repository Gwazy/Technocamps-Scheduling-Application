import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import "react-datepicker/dist/react-datepicker.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home/Home";
import { useState, useEffect } from "react";
import Login from "./Login/Login";
import Register from "./Register/Register";
import Navbar from "./Navbar/Navbar";
import Course from "./Course/Course";
import Booking from "./Booking/Booking";
import MyBooking from "./MyBooking/MyBooking";
import Unauthorized from "./Unauthorized/Unauthorized";
import NotFound from "./NotFound/NotFound";

const axios = require("axios");
const backendApi = "http://localhost:8000/api";

function App() {
  const [user, setUser] = useState(false);

  useEffect(() => {
    axios.defaults.withCredentials = true;

    axios
      .post(backendApi + "/authCheck")
      .then((response) => {
        if (response.status === 200 && !user) {
          console.log(response.data);
          setUser({
            username: response.data.username,
            id: response.data.id,
            isAdmin: response.data.isAdmin,
          });
        } else {
          setUser({});
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  {
    /* <Route exact path="/profile"></Route> Should be able to see their profile, and update details*/
  }
  return (
    <Router>
      <Navbar user={user}></Navbar>
      <Routes>
        <Route exact path="/" element={<Home user={user} />}></Route>
        <Route exact path="/login" element={<Login user={user} />}></Route>
        <Route
          exact
          path="/register"
          element={<Register user={user} />}
        ></Route>
        <Route exact path="/course" element={<Course user={user} />}></Route>
        <Route exact path="/bookings" element={<Booking user={user} />}></Route>
        <Route
          exact
          path="/mybooking"
          element={<MyBooking user={user} />}
        ></Route>
        <Route exact path="/unauthorized" element={<Unauthorized />}></Route>
        <Route exact path="*" element={<NotFound />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
