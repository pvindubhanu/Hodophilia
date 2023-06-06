import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Contexts
import { LoginContextProvider } from "./contexts/loginContext.js";

// screens
import Index from './components/screens/index.jsx';
import Login from './components/screens/login.jsx';
import VerifyLogin from './components/screens/verifylogin.jsx';
import Signup from './components/screens/signup.jsx';
import QRCode from './components/screens/qrcode.jsx';
import ResetPassword from './components/screens/reset-password.jsx';
import AccountRecovery from './components/screens/account-recovery';
import Search from './components/screens/search.jsx';
import SearchedCity from './components/screens/searchedcity.jsx';
import Error from './components/screens/error.jsx';
import Profile from "./components/screens/profile.jsx";
import CreateItinerary from "./components/screens/create-new-itinerary.jsx";
import Restaurants from "./components/screens/Restaurants.jsx";
import Hotels from "./components/screens/Hotels.jsx"
import HotelBookingForm from "./components/screens/HotelBookingForm.jsx"
import Shared from "./components/screens/shared";
import SharedItrWithComments from "./components/screens/sharedItrWithComments";
import Flights from "./components/screens/flights.jsx";
import BookingDetails from "./components/screens/BookingDetails.jsx";


// components
import Navbar from './components/navbar'
import BookFlights from "./components/screens/BookFlights";
import LoginOAuth from "./components/screens/LoginOAuth";

function App() {
  
  const [navpagestate, setNavPageState] = useState(false);
  
  useEffect(() => {
    console.log(navpagestate, "navpagestate");
  }, [navpagestate])

  return (
    <LoginContextProvider>
      <BrowserRouter>
        <Navbar setNavPageState={setNavPageState} />
        <Routes>
          <Route path="/">
            <Route index element={<Index />} />
            <Route path="login" element={<Login />} />
            <Route path="verifylogin" element={<VerifyLogin />} />
            <Route path="signup" element={<Signup />} />
            <Route path="qrcode" element={<QRCode />} />
            <Route path="auth/reset_password" element={<ResetPassword />} />
            <Route path="account-recovery" element={<AccountRecovery />} />
            <Route path="search" element={<Search />} />
            <Route path="city" element={<SearchedCity />} />
            <Route path="profile" element={<Profile navpagestate={navpagestate} />} />
            <Route path="create-new-itinerary" element={<CreateItinerary />} />
            <Route path="restaurants" element={<Restaurants />} />
            <Route path="hotels" element={<Hotels />} />
            <Route path="hotel-booking" element={<HotelBookingForm />} />
            <Route path="shared" element={<Shared />} />
            <Route path="sharedItr" element={<SharedItrWithComments />} />
            <Route path="flights" element={<Flights />} />
            <Route path="flights" element={<Flights />} />
            <Route path="bookFlights" element={<BookFlights />} />
            <Route path="shared" element={<Shared />} />
            <Route path="sharedItr" element={<SharedItrWithComments />} />
            <Route path="booking-details" element={<BookingDetails />} />
            <Route path="/login/oauth-sucess/*" element={<LoginOAuth />} />
            
            <Route path="*" element={<Error />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LoginContextProvider>
  );
}

export default App;
