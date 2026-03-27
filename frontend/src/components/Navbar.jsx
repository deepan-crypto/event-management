import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { logout } from '../redux/authSlice';
import {
    GraduationCap,
    LogOut,
    User,
    ChevronDown,
    Bell,
} from 'lucide-react';

export default function Navbar() {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = React.useState(false);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <nav style={{
            background: 'linear-gradient(135deg, #00224d 0%, #003366 40%, #004a99 100%)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            position: 'sticky',
            top: 0,
            zIndex: 40,
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '0 24px',
                height: '68px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                {/* Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                    <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #FFD700, #FFE44D)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(255, 215, 0, 0.35)',
                    }}>
                        <GraduationCap size={24} color="#003366" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 style={{ color: 'white', fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>SECE</h1>
                        <p style={{ color: 'rgba(255,215,0,0.85)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Event Management</p>
                    </div>
                </Link>

                {/* Nav Links (desktop) */}
                {user && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <NavLink to={user.role === 'admin' ? '/admin' : '/dashboard'} label="Dashboard" />
                        <NavLink to="/events" label="Events" />
                        <NavLink to="/calendar" label="Calendar" />
                        {user.role === 'student' && <NavLink to="/my-events" label="My Events" />}
                        {user.role === 'admin' && <NavLink to="/admin/create" label="Create Event" />}
                    </div>
                )}

                {/* Right side */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {user ? (
                        <>
                            <button style={{
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '8px',
                                cursor: 'pointer',
                                color: 'white',
                                display: 'flex',
                            }}>
                                <Bell size={18} />
                            </button>

                            <div style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        background: 'rgba(255,255,255,0.1)',
                                        border: '1px solid rgba(255,255,255,0.15)',
                                        borderRadius: '12px',
                                        padding: '6px 14px 6px 8px',
                                        cursor: 'pointer',
                                        color: 'white',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '8px',
                                        background: 'linear-gradient(135deg, #FFD700, #FFE44D)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <User size={16} color="#003366" strokeWidth={2.5} />
                                    </div>
                                    <div style={{ textAlign: 'left' }}>
                                        <p style={{ fontSize: '0.8rem', fontWeight: 600, lineHeight: 1.2 }}>{user.name}</p>
                                        <p style={{ fontSize: '0.65rem', opacity: 0.7, textTransform: 'capitalize' }}>{user.role}</p>
                                    </div>
                                    <ChevronDown size={14} style={{ opacity: 0.7, transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                                </button>

                                {dropdownOpen && (
                                    <div style={{
                                        position: 'absolute',
                                        right: 0,
                                        top: 'calc(100% + 8px)',
                                        background: 'white',
                                        borderRadius: '12px',
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                                        border: '1px solid #E2E8F0',
                                        minWidth: '200px',
                                        overflow: 'hidden',
                                        animation: 'fadeInUp 0.2s ease',
                                    }}>
                                        <div style={{ padding: '14px 16px', borderBottom: '1px solid #E2E8F0' }}>
                                            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1E293B' }}>{user.name}</p>
                                            <p style={{ fontSize: '0.75rem', color: '#64748B' }}>{user.email}</p>
                                            <p style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '2px' }}>{user.department} • {user.role}</p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: '#EF4444',
                                                fontSize: '0.85rem',
                                                fontWeight: 500,
                                                transition: 'background 0.2s',
                                            }}
                                            onMouseEnter={(e) => e.target.style.background = '#FEF2F2'}
                                            onMouseLeave={(e) => e.target.style.background = 'none'}
                                        >
                                            <LogOut size={16} /> Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Link to="/login" className="btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', padding: '8px 20px', fontSize: '0.8rem' }}>
                                Log In
                            </Link>
                            <Link to="/signup" className="btn-secondary" style={{ padding: '8px 20px', fontSize: '0.8rem', textDecoration: 'none' }}>
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Click outside to close */}
            {dropdownOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: -1 }} onClick={() => setDropdownOpen(false)} />
            )}
        </nav>
    );
}

function NavLink({ to, label }) {
    const location = useLocation();
    const isActive = location.pathname === to;
    return (
        <Link
            to={to}
            style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 500,
                color: isActive ? '#FFD700' : 'rgba(255,255,255,0.8)',
                background: isActive ? 'rgba(255,215,0,0.1)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { if (!isActive) e.target.style.background = 'rgba(255,255,255,0.1)'; }}
            onMouseLeave={(e) => { if (!isActive) e.target.style.background = 'transparent'; }}
        >
            {label}
        </Link>
    );
}
