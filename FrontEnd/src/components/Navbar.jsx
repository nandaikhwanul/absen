import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const Logout = async () => {
    try {
      await axios.delete('http://localhost:5000/logout'); // Corrected the endpoint name
      navigate("/"); // Redirect to the home page after logout
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <nav>
      <header>
        <div className=" top-0 w-60 bg-white p-6 shadow-md h-full fixed z-20">
          <div className="flex space-x-6 mb-6">
            
            <h1>Dashboard</h1>
          </div>
          <ul className="flex flex-col space-y-6 mt-14 border-t py-6">
            
            <li className="cursor-pointer" onClick={() => navigate("/dashboard")}>Data</li>
            <li className="cursor-pointer" onClick={() => navigate("/barcode-profile")}>Profile & Barcode</li>

            <li className="cursor-pointer hover:bg-red-500 transition duration-500" onClick={Logout}>Logout</li> {/* Logout button */}
          </ul>
        </div>
      </header>
    </nav>
  );
}

export default Navbar;
