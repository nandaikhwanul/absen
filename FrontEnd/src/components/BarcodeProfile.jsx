import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode'; // Import QRCode
import Person from '../img/person.png'

const BarcodeProfile = () => {
    const [name, setName] = useState('');
    const [nip, setNip] = useState('');
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [qrCodeUrl, setQrCodeUrl] = useState(''); // State for storing QR code URL
    const navigate = useNavigate();

    useEffect(() => {
        refreshToken();
    }, []);

    useEffect(() => {
        if (name && nip && email) {
            generateQRCode(); // Generate QR code when name, nip, or email changes
        }
    }, [name, nip, email]);

    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:5000/token');
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            console.log(decoded); // Check the decoded token

            setNip(decoded.nip); // Set nip here
            setName(decoded.nama); // Set name here
            setEmail(decoded.email);
            setExpire(decoded.exp);

        } catch (error) {
            if (error.response) {
                navigate("/");
            }
        }
    };

    const generateQRCode = async () => {
        const qrData = `Nama: ${name}, NIP: ${nip}, Email: ${email}`;
        try {
            const url = await QRCode.toDataURL(qrData);
            setQrCodeUrl(url); // Set QR code URL state
        } catch (error) {
            console.error("Failed to generate QR code", error);
        }
    };

    return (
        <div className="overflow-y-auto sm:p-0 pt-4 pr-4 pb-20 pl-4 bg-slate-300">
            <div className="flex justify-center items-end text-center min-h-screen sm:block">
                <div className="bg-gray-500 transition-opacity bg-opacity-75"></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">​</span>
                <div className="inline-block text-left bg-white rounded-lg overflow-hidden align-bottom transition-all transform shadow-2xl sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
                    <div className="items-center w-full mr-auto ml-auto relative max-w-7xl md:px-12 lg:px-24">
                        <div className="grid grid-cols-1">
                            <div className="mt-4 mr-auto mb-4 ml-auto bg-white max-w-lg">
                                <div className="flex flex-col items-center pt-6 pr-6 pb-6 pl-6">
                                    <img src={Person} alt="Profile" className="flex-shrink-0 object-cover object-center w-16 h-16 -mb-8 rounded-full border-[1px] border-slate-600"
                                    />
                                    <p className="mt-8 text-2xl font-semibold leading-none text-black tracking-tighter lg:text-3xl mb-8">{name}</p>
                                    <div className='grid gap-3 text-center'> {/* Center text here */}
                                        <span className="">{name}</span>
                                        <span className="">{nip}</span>
                                        <span className="">{email}</span>
                                    </div>
                                    {qrCodeUrl && ( // Render QR code if it exists
                                        <div className="mt-4">
                                            <img src={qrCodeUrl} alt="QR Code" />
                                        </div>
                                    )}
                                    <div className="w-full mt-6">
                                        <a
                                            href="#"
                                            className="flex text-center items-center justify-center w-full pt-4 pr-10 pb-4 pl-10 text-base font-medium text-white bg-indigo-600 rounded-xl transition duration-500 ease-in-out transform hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Your QR Code Is Here
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BarcodeProfile;
