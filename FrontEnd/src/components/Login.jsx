import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [nip, setNip] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    const Auth = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', {
                nip,
                password
            });

            // Menyimpan access token di localStorage
            localStorage.setItem('accessToken', response.data.accessToken);

            // Verifikasi token setelah login sukses
            await verifyAccessToken(response.data.accessToken);

            navigate("/dashboard");
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };

    // Fungsi untuk memverifikasi token
    const verifyAccessToken = async (token) => {
        try {
            const response = await axios.get('http://localhost:5000/protected-route', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Token verified:", response.data);
        } catch (error) {
            console.error("Token verification failed:", error.response.data.msg);
        }
    };

    return (
        <section className="flex justify-center items-center h-screen overflow-hidden">
            <div className="bg-gray-100 flex justify-center items-center h-screen w-full">
                <div className="w-1/2 h-screen hidden lg:block">
                    <img 
                        src="https://placehold.co/800x/667fff/ffffff.png?text=Your+Image&font=Montserrat" 
                        alt="Placeholder" 
                        className="object-cover w-full h-full" 
                    />
                </div>
                <div className="lg:p-36 md:p-52 sm:p-20 p-8 w-full lg:w-1/2">
                    <h1 className="text-2xl font-semibold mb-4">Login</h1>
                    <form onSubmit={Auth}>
                        <p className="text-red-500 text-center">{msg}</p>
                        <div className="mb-4">
                            <label htmlFor="nip" className="block text-gray-600">NIP</label>
                            <input
                                type="text"
                                id="nip"
                                name="nip"
                                value={nip}
                                onChange={(e) => setNip(e.target.value)}
                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                placeholder="Input Your NIP"
                                autoComplete="off"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-600">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                placeholder="Input Your Password"
                                autoComplete="off"
                            />
                        </div>
                        <div className="mb-4 flex items-center">
                            <input type="checkbox" id="remember" name="remember" className="text-blue-500" />
                            <label htmlFor="remember" className="text-gray-600 ml-2">Remember Me</label>
                        </div>
                        <div className="mb-6 text-blue-500">
                            <a href="#" className="hover:underline">Forgot Password?</a>
                        </div>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full">
                            Login
                        </button>
                    </form>
                    <div className="mt-6 text-blue-500 text-center">
                        <a href="/register" className="hover:underline">Sign up Here</a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
