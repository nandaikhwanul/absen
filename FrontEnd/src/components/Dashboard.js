import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [users, setUsers] = useState([]);
  const [verificationMessage, setVerificationMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Refresh token and get users only after the token is set
    const initialize = async () => {
      await refreshToken();
      await getUsers();
    };
    initialize();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get('http://localhost:5000/token');
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setName(decoded.nama);
      setExpire(decoded.exp);
    } catch (error) {
      // Navigate to login if token refresh fails
      if (error.response) {
        navigate("/");
      }
    }
  };

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(async (config) => {
    const currentDate = new Date();
    if (expire * 1000 < currentDate.getTime()) {
      // Refresh the token if it's expired
      try {
        const response = await axios.get('http://localhost:5000/token');
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken);
        setName(decoded.nama);
        setExpire(decoded.exp);
      } catch (error) {
        navigate("/"); // Redirect to login if refreshing token fails
      }
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  const getUsers = async () => {
    try {
      const response = await axiosJWT.get('http://localhost:5000/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(response.data);
    } catch (error) {
      // Handle errors from getUsers API call
      if (error.response) {
        console.error("Error fetching users:", error.response.data);
      }
    }
  };

  const verifyToken = async () => {
    try {
      const response = await axios.post('http://localhost:5000/verify', { token });
      setVerificationMessage(response.data.message);
    } catch (error) {
      setVerificationMessage('Token verification failed.');
    }
  };

  return (
    <div className='container mx-auto mt-40 relative left-56'>
      <h1 className='text-2xl font-bold text-start mb-5'>Hello, {name}</h1>
      
      
      
      {verificationMessage && <p className="text-green-500">{verificationMessage}</p>}

      <table className="border-collapse w-auto">
        <thead className=''>
          <tr>
            <th className="p-0 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">Nama</th>
            <th className="p-0 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">NIP</th>
            <th className="p-0 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">Last Login</th>
            <th className="p-0 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">Last Logout</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index} className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-2">
              <td className="w-full lg:w-auto p-0 text-gray-800 text-center border border-b block lg:table-cell relative lg:static px-8">{user.nama}</td>
              <td className="w-full lg:w-auto p-0 text-gray-800 text-center border border-b text-center block lg:table-cell relative lg:static px-8">{user.nip}</td>
              <td className="w-full lg:w-auto p-0 text-gray-800 text-center border border-b text-center block lg:table-cell relative lg:static px-8">{user.last_login ? new Date(user.last_login).toLocaleString() : 'N/A'}</td>
              <td className="w-full lg:w-auto p-0 text-gray-800 text-center border border-b text-center block lg:table-cell relative lg:static px-8">{user.last_logout ? new Date(user.last_logout).toLocaleString() : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
