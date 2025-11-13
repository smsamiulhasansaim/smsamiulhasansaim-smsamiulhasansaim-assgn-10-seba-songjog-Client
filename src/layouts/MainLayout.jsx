import React from 'react';
import Navbar from '../components/common/Navbar';
import { Outlet } from 'react-router';
import Footer from '../components/common/Footer';
import { AuthProvider } from '../context/AuthContext';

const MainLayout = () => {
    return (
        <AuthProvider>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </AuthProvider>
    );
};

export default MainLayout;