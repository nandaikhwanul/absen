import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [nip, setNip] = useState('');
    const [nama, setNama] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/users', {
                nip: nip,
                nama: nama,
                email: email,
                password: password,
                confPassword: confPassword
            });
            navigate("/");
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            } else {
                setMsg("Terjadi kesalahan. Silakan coba lagi.");
            }
        }
    };

    return (
        <section className="flex justify-center items-center h-screen bg-gray-100 overflow-hidden">
            {/* Left: Image */}
            <div className="w-1/2 h-screen hidden lg:block ">
                <img src="https://placehold.co/800x/667fff/ffffff.png?text=Your+Image&font=Montserrat"
                    alt="Placeholder Image"
                    className="object-cover w-full h-full" />
            </div>
            {/* Right: Register Form */}
            <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
                <h1 className="text-2xl font-semibold mb-4">Register</h1>
                <form onSubmit={handleRegister}>
                    {/* Error message display */}
                    <p className="text-red-500 text-center">{msg}</p>
                    
                    {/* NIP Input */}
                    <div className="mb-4">
                        <label htmlFor="nip" className="block text-gray-600">NIP</label>
                        <input
                            type="text"
                            id="nip"
                            name="nip"
                            value={nip}
                            onChange={(e) => setNip(e.target.value)}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                            autoComplete="off"
                            placeholder="Enter your NIP"
                        />
                    </div>

                    {/* Name Input */}
                    <div className="mb-4">
                        <label htmlFor="nama" className="block text-gray-600">Nama</label>
                        <input
                            type="text"
                            id="nama"
                            name="nama"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                            autoComplete="off"
                            placeholder="Enter your name"
                        />
                    </div>

                    {/* Email Input */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-600">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                            autoComplete="off"
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-600">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                            autoComplete="off"
                            placeholder="Enter your password"
                        />
                    </div>

                    {/* Confirm Password Input */}
                    <div className="mb-4">
                        <label htmlFor="confPassword" className="block text-gray-600">Confirm Password</label>
                        <input
                            type="password"
                            id="confPassword"
                            name="confPassword"
                            value={confPassword}
                            onChange={(e) => setConfPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                            autoComplete="off"
                            placeholder="Confirm your password"
                        />
                    </div>

                    {/* Register Button */}
                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full">
                        Register
                    </button>
                </form>

                {/* Already have an account? */}
                <div className="mt-6 text-blue-500 text-center">
                    <a href="/" className="hover:underline">Already have an account? Login Here</a>
                </div>
            </div>
        </section>
    );
};

export default Register;
