import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    GraduationCap,
    Calendar,
    Users,
    Trophy,
    ArrowRight,
    Star,
    Sparkles,
    BookOpen,
    Zap,
} from 'lucide-react';

export default function HeroPage() {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (user) {
            navigate(user.role === 'admin' ? '/admin' : '/dashboard');
        }
    }, [user, navigate]);

    return (
        <div style={{ minHeight: 'calc(100vh - 68px)' }}>
            {/* Hero Section */}
            <section className="gradient-hero" style={{
                padding: '80px 24px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Decorative elements */}
                <div style={{ position: 'absolute', top: '20%', right: '10%', width: '300px', height: '300px', background: 'rgba(255,215,0,0.08)', borderRadius: '50%', filter: 'blur(60px)' }} />
                <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: '200px', height: '200px', background: 'rgba(255,255,255,0.04)', borderRadius: '50%', filter: 'blur(40px)' }} />

                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                    {/* Left */}
                    <div className="animate-fadeInUp">
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'rgba(255,215,0,0.15)',
                            border: '1px solid rgba(255,215,0,0.3)',
                            borderRadius: '9999px',
                            padding: '6px 16px',
                            marginBottom: '24px',
                        }}>
                            <Sparkles size={14} color="#FFD700" />
                            <span style={{ color: '#FFD700', fontSize: '0.8rem', fontWeight: 600 }}>Sri Eshwar College of Engineering</span>
                        </div>

                        <h1 style={{
                            fontSize: '3.2rem',
                            fontWeight: 900,
                            color: 'white',
                            lineHeight: 1.1,
                            letterSpacing: '-0.03em',
                            marginBottom: '20px',
                        }}>
                            SECE <span style={{ color: '#FFD700' }}>Event</span><br />
                            Management<br />
                            System
                        </h1>

                        <p style={{
                            fontSize: '1.1rem',
                            color: 'rgba(255,255,255,0.7)',
                            lineHeight: 1.6,
                            marginBottom: '32px',
                            maxWidth: '480px',
                        }}>
                            Discover, register, and manage college events seamlessly.
                            From symposiums to sports — everything in one place.
                        </p>

                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <Link to="/signup" className="btn-secondary" style={{ padding: '14px 32px', fontSize: '0.95rem', textDecoration: 'none' }}>
                                Get Started <ArrowRight size={18} />
                            </Link>
                            <Link to="/login" className="btn-outline" style={{ padding: '14px 32px', fontSize: '0.95rem', color: 'white', borderColor: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>
                                Sign In
                            </Link>
                        </div>
                    </div>

                    {/* Right - Stats Cards */}
                    <div className="animate-slideInRight" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <StatCard icon={<Calendar size={28} />} number="50+" label="Events Yearly" color="#FFD700" delay="0s" />
                        <StatCard icon={<Users size={28} />} number="5000+" label="Students" color="#10B981" delay="0.1s" />
                        <StatCard icon={<BookOpen size={28} />} number="10+" label="Departments" color="#3B82F6" delay="0.2s" />
                        <StatCard icon={<Trophy size={28} />} number="100+" label="Winners" color="#F59E0B" delay="0.3s" />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section style={{ padding: '80px 24px', background: 'white' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1E293B', marginBottom: '12px' }}>
                        Everything You Need
                    </h2>
                    <p style={{ fontSize: '1rem', color: '#64748B', marginBottom: '48px' }}>
                        A complete platform for managing college events efficiently
                    </p>

                    <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                        <FeatureCard
                            icon={<Calendar size={28} color="#003366" />}
                            title="Browse Events"
                            desc="Explore upcoming symposiums, workshops, sports events, and more across all departments."
                        />
                        <FeatureCard
                            icon={<Zap size={28} color="#003366" />}
                            title="Instant Registration"
                            desc="Register for events with a single click and receive a QR code for venue attendance."
                        />
                        <FeatureCard
                            icon={<Star size={28} color="#003366" />}
                            title="Department Filtering"
                            desc="Filter events by your department — CSE, ECE, AI&DS, and more. Never miss relevant events."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{
                background: '#003366',
                padding: '40px 24px',
                textAlign: 'center',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
                    <GraduationCap size={22} color="#FFD700" />
                    <span style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>SECE Event Management</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                    © 2024 Sri Eshwar College of Engineering. All rights reserved.
                </p>
            </footer>
        </div>
    );
}

function StatCard({ icon, number, label, color, delay }) {
    return (
        <div style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '16px',
            padding: '28px 20px',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            animationDelay: delay,
        }}
            className="glass-card-hover"
        >
            <div style={{ color, marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>{icon}</div>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: 'white', lineHeight: 1 }}>{number}</p>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>{label}</p>
        </div>
    );
}

function FeatureCard({ icon, title, desc }) {
    return (
        <div className="glass-card glass-card-hover" style={{ padding: '32px 24px', textAlign: 'left' }}>
            <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                background: 'rgba(0,51,102,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
            }}>
                {icon}
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', marginBottom: '8px' }}>{title}</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.6 }}>{desc}</p>
        </div>
    );
}
