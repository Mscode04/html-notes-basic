// src/Main/LandingPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaClinicMedical,
  FaUserNurse,
  FaHeartbeat,
  FaMobileAlt,
  FaCheckCircle,
  FaFileMedical,
  FaClock,
  FaRobot,
  FaRegChartBar,
 
} from "react-icons/fa";

import logo from '../assets/img/logo-1.png';
import successImage from '../assets/img/award.jpg';
import "./LandingPage.css";

const LandingPage = ({ isAuthenticated, isNurse }) => {
    const navigate = useNavigate();
    const [installPrompt, setInstallPrompt] = useState(null);
    const [isInstalled, setIsInstalled] = useState(false);
    

    useEffect(() => {
        const handleBeforeInstallPrompt = (event) => {
            event.preventDefault();
            setInstallPrompt(event);
        };

        // Check if app is installed
        if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
            setIsInstalled(true);
        }

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', () => setIsInstalled(true));

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', () => setIsInstalled(true));
        };
    }, []);

    const handleLoginRedirect = () => navigate("/login");
    const handleProfileRedirect = () => {
        isNurse ? navigate("/main") : navigate(`/users/${localStorage.getItem("patientId")}`);
    };
    const handleAboutRedirect = () => navigate("/about");

    const handleInstallClick = async () => {
        if (installPrompt) {
            installPrompt.prompt();
            const { outcome } = await installPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
                setIsInstalled(true);
            }
            setInstallPrompt(null);
        }
    };

    

const features = [
    {
        icon: <FaHeartbeat className="feature-icon" />,
        title: "Real-time Monitoring",
        description: "Continuous tracking of vital signs and symptoms for proactive care management."
    },
    {
        icon: <FaUserNurse className="feature-icon" />,
        title: "Care Team Coordination",
        description: "Seamless communication between doctors, nurses, and caregivers."
    },
    {
        icon: <FaFileMedical className="feature-icon" />,
        title: "Case Management",
        description: "Quick case additions with easy-to-navigate reports, filters, and search functionalities."
    },
    {
        icon: <FaClock className="feature-icon" />,
        title: "Efficient Scheduling System",
        description: "Automated and manual scheduling for catheter changes and home visits to optimize workflow."
    },
    {
        icon: <FaRobot className="feature-icon" />,
        title: "AI Chatbot Assistance",
        description: "24/7 intelligent support for users to streamline queries and improve engagement."
    },
    {
        icon: <FaRegChartBar className="feature-icon" />,
        title: "Insightful Reporting Tools",
        description: "Access annual and individual reports with enhanced admin-level visibility and analytics."
    }
];


    const stats = [
        { value: "400+", label: "Patients" },
        { value: "29,000+", label: "Home Care Visits" },
        { value: "300+", label: "Volenterrs" },
        { value: "2,000+", label: "Reports" }
    ];

    return (
        <div className="landing-page app-style">
            {/* Navbar */}
            <nav className="app-navbar">
                <div className="navbar-container">
                    <div className="logo-container">
                        <img src={logo} alt="Neu Health Care Logo" className="logo" />
                        <span className="navbar-logo-tx">euraq Care</span>
                    </div>
                    
                    <div className="nav-buttons">
                        {isAuthenticated ? (
                            <button className="nav-button primary" onClick={handleProfileRedirect}>
                                My Profile
                            </button>
                        ) : (
                            <button className="nav-button outline" onClick={handleLoginRedirect}>
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1>Palliative Care Makkaraparamba</h1>
                    <p className="hero-subtitle">
                        Revolutionizing Palliative Care with <span style={{ color: '#2564eb', fontWeight: 'bold' }}>Neuraq</span>, Compassionate Healthcare Solutions.
                    </p>
                    
                    <div className="hero-cta">
                        {isInstalled ? (
                            <>
                                {isAuthenticated ? (
                                    <button className="cta-button primary me-2" onClick={handleProfileRedirect}>
                                        <FaUserNurse className="cta-icon" />
                                        Go to Profile
                                    </button>
                                ) : (
                                    <button className="cta-button primary me-2" onClick={handleLoginRedirect}>
                                        <FaUserNurse className="cta-icon" />
                                        Login
                                    </button>
                                )}
                                <button className="cta-button outline" onClick={handleAboutRedirect}>
                                    <FaClinicMedical className="cta-icon" />
                                    About Us
                                </button>
                            </>
                        ) : (
                            <button className="cta-button primary" onClick={handleInstallClick}>
                                <FaMobileAlt className="cta-icon" />
                                Install App
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="">
                <div className="section-container">
                    <div className="stats-grid">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-card">
                                <div className="stat-value">{stat.value}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="section-container">
                    <div className="section-header">
                        <h2>Key Features</h2>
                        <p className="section-subtitle">
                            Everything you need for comprehensive palliative care
                        </p>
                    </div>
                    
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card">
                                <div className="feature-icon-container">
                                    {feature.icon}
                                </div>
                                <h3 className="feature-title">{feature.title}</h3>
                                {/* <p className="feature-description">{feature.description}</p> */}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Success Story Section */}
<section className="success-stories">
    <div className="section-container">
        <div className="section-header center">
            <h2>Transforming Palliative Care Through Innovation</h2>
            <p className="section-subtitle">
                Our journey of blending technology with compassionate care
            </p>
        </div>

        <div className="story-grid">
            {/* Story 1 - App Launch */}
            <div className="story-card">
             {/* Story 3 - Impact Video */}
            <div className="story-card full-width">
                <div className="story-media">
                    <div className="video-wrapper">
                        <iframe 
                            src="https://www.youtube.com/embed/bWC2LIubqRQ" 
                            title="Patient Impact Stories" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
                {/* <div className="story-content center">
                    <h3>Hear From Those We've Helped</h3>
                    <p>
                        Watch how our technology has improved the quality of care for patients and eased the workload 
                        for healthcare providers in rural communities.
                    </p>
                </div> */}
            </div>
                <div className="story-media">
                    <div className="video-wrapper">
                        <iframe 
                            src="https://www.youtube.com/embed/CQopDGLB2V0" 
                            title="Neuraq App Launch" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
                <div className="story-content">
                    <h3>Revolutionizing Patient Care</h3>
                    <p>
                        On May 18, 2025, Neuraq Technologies launched its mobile application at the "Arike" patient gathering, 
                        transforming how palliative care is delivered in rural communities. The app streamlines patient management, 
                        allowing healthcare workers to focus more on direct patient care.
                    </p>
                    <div className="story-highlight">
                        <FaCheckCircle className="highlight-icon" />
                        <span>Officially launched by Dr. P. Unni and Muhammad Musthafa Tharayil</span>
                    </div>
                </div>
            </div>

            {/* Story 2 - Team Recognition */}
            <div className="story-card reverse">
                <div className="story-media">
                    <img src={successImage} alt="Neuraq team receiving award" className="story-image" />
                </div>
                <div className="story-content">
                    <h3>Recognizing Excellence</h3>
                    <p>
                        The Neuraq development team was honored by Makkaraparamba Palliative for their groundbreaking work. 
                        This recognition celebrates our commitment to creating technology solutions that make real differences 
                        in patients' lives.
                    </p>
                    <div className="story-highlight">
                        <FaCheckCircle className="highlight-icon" />
                        <span>Received memento for impactful healthcare contribution</span>
                    </div>
                </div>
            </div>

           
        </div>
    </div>
</section>




         
        </div>
    );
};

export default LandingPage;