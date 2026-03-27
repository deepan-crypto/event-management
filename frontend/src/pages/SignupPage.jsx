import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser, clearError } from '../redux/authSlice';
import { GraduationCap, Mail, Lock, Eye, EyeOff, User, Phone, Hash, Building, ArrowRight } from 'lucide-react';

const DEPARTMENTS = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AI&DS', 'IT', 'BME', 'Placement Cell', 'Other'];

export default function SignupPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        rollNumber: '',
        department: '',
        password: '',
        confirmPassword: '',
        phone: '',
        role: 'student',
    });
    const [formError, setFormError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        dispatch(clearError());

        // Validate roll number only for students
        if (form.role === 'student' && !form.rollNumber.trim()) {
            setFormError('Roll Number is required for students.');
            return;
        }

        if (form.password !== form.confirmPassword) {
            setFormError('Passwords do not match.');
            return;
        }
        if (form.password.length < 6) {
            setFormError('Password must be at least 6 characters.');
            return;
        }

        const { confirmPassword, ...submitData } = form;
        // Clear rollNumber for admin/faculty
        if (submitData.role === 'admin') {
            submitData.rollNumber = '';
        }
        const result = await dispatch(signupUser(submitData));
        if (signupUser.fulfilled.match(result)) {
            const role = result.payload.user.role;
            navigate(role === 'admin' ? '/admin' : '/dashboard');
        }
    };

    const displayError = formError || error;

    return (
        <div style={{
            minHeight: 'calc(100vh - 68px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 24px',
            background: 'linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 100%)',
        }}>
            <div className="glass-card animate-fadeInUp" style={{ width: '100%', maxWidth: '520px', padding: '40px' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '14px',
                        background: 'linear-gradient(135deg, #003366, #004a99)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                        boxShadow: '0 4px 12px rgba(0,51,102,0.3)',
                    }}>
                        <GraduationCap size={28} color="#FFD700" />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E293B', marginBottom: '4px' }}>Create Account</h2>
                    <p style={{ fontSize: '0.85rem', color: '#64748B' }}>Join the SECE Event Management System</p>
                </div>

                {displayError && (
                    <div style={{
                        padding: '12px 16px',
                        background: '#FEF2F2',
                        border: '1px solid #FECACA',
                        borderRadius: '10px',
                        marginBottom: '20px',
                        color: '#DC2626',
                        fontSize: '0.85rem',
                    }}>
                        {displayError}
                    </div>
                )}

                {/* Role Toggle */}
                <div style={{
                    display: 'flex',
                    background: '#F1F5F9',
                    borderRadius: '10px',
                    padding: '4px',
                    marginBottom: '24px',
                }}>
                    {['student', 'admin'].map((role) => (
                        <button
                            key={role}
                            type="button"
                            onClick={() => setForm({ ...form, role })}
                            style={{
                                flex: 1,
                                padding: '10px',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                transition: 'all 0.2s',
                                background: form.role === role ? '#003366' : 'transparent',
                                color: form.role === role ? 'white' : '#64748B',
                            }}
                        >
                            {role === 'student' ? '🎓 Student' : '👨‍🏫 Admin / Faculty'}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                        <InputField icon={<User size={16} />} label="Full Name" placeholder="John Doe" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
                        <InputField icon={<Mail size={16} />} label="Email" placeholder="you@sece.ac.in" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
                    </div>

                    {form.role === 'student' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                            <InputField icon={<Hash size={16} />} label="Roll Number" placeholder="22XXXXX" value={form.rollNumber} onChange={(v) => setForm({ ...form, rollNumber: v })} required />
                            <InputField icon={<Phone size={16} />} label="Phone" placeholder="9876543210" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                        </div>
                    )}
                    {form.role === 'admin' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px', marginBottom: '14px' }}>
                            <InputField icon={<Phone size={16} />} label="Phone" placeholder="9876543210" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                        </div>
                    )}

                    <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                            <Building size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                            Department
                        </label>
                        <select
                            className="select-field"
                            value={form.department}
                            onChange={(e) => setForm({ ...form, department: e.target.value })}
                            required
                        >
                            <option value="">Select department</option>
                            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="input-field"
                                    placeholder="Min 6 characters"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    required
                                    style={{ paddingLeft: '42px', paddingRight: '42px' }}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', display: 'flex' }}>
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Confirm</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="input-field"
                                    placeholder="Re-type password"
                                    value={form.confirmPassword}
                                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                    required
                                    style={{ paddingLeft: '42px' }}
                                />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '0.95rem' }}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: '#64748B' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#003366', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
                </p>
            </div>
        </div>
    );
}

function InputField({ icon, label, placeholder, type = 'text', value, onChange, required }) {
    return (
        <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>{label}</label>
            <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>{icon}</span>
                <input
                    type={type}
                    className="input-field"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required={required}
                    style={{ paddingLeft: '42px' }}
                />
            </div>
        </div>
    );
}
