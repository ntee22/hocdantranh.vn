import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import useCurrentUserProfile from '../../hooks/useCurrentUserProfile';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { user, isSuperAdmin, isTeacher } = useCurrentUserProfile();

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleLinkClick = () => {
        setIsOpen(false);
        // Scroll to top when menu item is clicked
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    };

    const navLinks = [
        { path: '/', label: 'Trang chủ' },
        { path: '/products', label: 'Đàn Tranh & Guzheng' },
        { path: '/sheet-music', label: 'Sheet nhạc' },
    ];

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    Học Đàn Tranh
                </Link>

                <div className="menu-icon" onClick={toggleMenu}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </div>

                <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
                    {navLinks.map((link) => (
                        <li key={link.path} className="nav-item">
                            <Link
                                to={link.path}
                                className={`nav-links ${location.pathname === link.path ? 'active-link' : ''}`}
                                onClick={handleLinkClick}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                    {user && isTeacher && (
                        <li className="nav-item">
                            <Link
                                to="/teacher"
                                className={`nav-links ${location.pathname === '/teacher' ? 'active-link' : ''}`}
                                onClick={handleLinkClick}
                                title="Giáo viên"
                            >
                                🎶
                            </Link>
                        </li>
                    )}
                    {user && isSuperAdmin && (
                        <li className="nav-item">
                            <Link
                                to="/admin"
                                className={`nav-links ${location.pathname === '/admin' ? 'active-link' : ''}`}
                                onClick={handleLinkClick}
                            >
                                Quản trị
                            </Link>
                        </li>
                    )}
                    {!user && (
                        <li className="nav-item">
                            <Link
                                to="/login"
                                className={`nav-links ${location.pathname === '/login' ? 'active-link' : ''}`}
                                onClick={handleLinkClick}
                                title="Đăng nhập"
                            >
                                🎶
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
