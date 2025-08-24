import React from "react";
import Navbar from "./navbar";
import Footer from "./Footer";

import { Outlet } from "react-router-dom";

const Body = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Body;
