import {
    BrowserRouter as Router,
    Routes,
    Route,
  } from "react-router-dom";
  

  import Home from "../pages/home/home.jsx";
  import MakePayment from "../pages/make-payment/payment-page.jsx";
  import History from "../pages/history/payment-history.jsx";
  
  function AppRouter() {
    return (
      <div>
        <Router>
          <Routes>
              <Route index element={<Home />} />
              <Route path="home" element={<Home />} /> 
              <Route path="make-payment" element={<MakePayment />} />
              <Route path="history" element={<History />} />
            </Routes>
        </Router>
      </div>
    );
  }
  
  export default AppRouter;