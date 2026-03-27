import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents, registerForEvent } from '../redux/eventSlice';
import EventCard from '../components/EventCard';
import { Search, Filter, Calendar, TrendingUp, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';

const DEPARTMENTS = ['All Departments', 'CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AI&DS', 'IT', 'BME', 'Placement Cell'];
const STATUSES = ['All', 'Upcoming', 'Ongoing', 'Completed'];
const EVENT_TYPES = ['All', 'Symposium', 'Workshop', 'Sports', 'Cultural', 'Seminar', 'Hackathon', 'Guest Lecture', 'Other'];

export default function StudentDashboard() {
    const dispatch = useDispatch();
    const { events, loading } = useSelector((state) => state.events);
    const { user } = useSelector((state) => state.auth);
    const [filters, setFilters] = useState({ department: '', status: '', eventType: '', search: '' });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const params = {};
        if (filters.department && filters.department !== 'All Departments') params.department = filters.department;
        if (filters.status && filters.status !== 'All') params.status = filters.status;
        if (filters.eventType && filters.eventType !== 'All') params.eventType = filters.eventType;
        if (filters.search) params.search = filters.search;
        dispatch(fetchEvents(params));
    }, [dispatch, filters]);

    const handleRegister = async (eventId) => {
        const result = await dispatch(registerForEvent(eventId));
        if (registerForEvent.fulfilled.match(result)) {
            toast.success('🎉 Successfully registered! Check "My Events" for your QR code.');
            dispatch(fetchEvents(filters));
        } else {
            toast.error(result.payload || 'Registration failed');
        }
    };

    const upcomingCount = events.filter((e) => e.status === 'Upcoming').length;
    const ongoingCount = events.filter((e) => e.status === 'Ongoing').length;

    return (
        <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '32px 24px' }}>
            {/* Welcome Header */}
            <div className="animate-fadeInUp" style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Sparkles size={20} color="#FFD700" />
                    <span style={{ fontSize: '0.85rem', color: '#FFD700', fontWeight: 600 }}>Welcome back</span>
                </div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E293B', marginBottom: '4px' }}>
                    Hello, {user?.name?.split(' ')[0]}! 👋
                </h1>
                <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Discover and register for exciting events at SECE</p>
            </div>

            {/* Stats */}
            <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
                <MiniStat icon={<Calendar size={20} />} label="Total Events" value={events.length} color="#003366" />
                <MiniStat icon={<TrendingUp size={20} />} label="Upcoming" value={upcomingCount} color="#F59E0B" />
                <MiniStat icon={<Sparkles size={20} />} label="Ongoing" value={ongoingCount} color="#10B981" />
            </div>

            {/* Search & Filter Bar */}
            <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                        <input
                            className="input-field"
                            placeholder="Search events..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            style={{ paddingLeft: '42px', border: '1.5px solid #E2E8F0' }}
                        />
                    </div>
                    <select className="select-field" style={{ width: 'auto', minWidth: '160px' }} value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value })}>
                        <option value="">All Departments</option>
                        {DEPARTMENTS.filter(d => d !== 'All Departments').map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="btn-outline"
                        style={{ padding: '10px 16px', fontSize: '0.8rem' }}
                    >
                        <Filter size={16} /> Filters
                    </button>
                </div>

                {showFilters && (
                    <div style={{ display: 'flex', gap: '12px', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #E2E8F0', flexWrap: 'wrap' }}>
                        <select className="select-field" style={{ width: 'auto', minWidth: '140px' }} value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                            <option value="">All Status</option>
                            {STATUSES.filter(s => s !== 'All').map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <select className="select-field" style={{ width: 'auto', minWidth: '140px' }} value={filters.eventType} onChange={(e) => setFilters({ ...filters, eventType: e.target.value })}>
                            <option value="">All Types</option>
                            {EVENT_TYPES.filter(t => t !== 'All').map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <button
                            onClick={() => setFilters({ department: '', status: '', eventType: '', search: '' })}
                            style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                        >
                            Clear All
                        </button>
                    </div>
                )}
            </div>

            {/* Events Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid #E2E8F0', borderTopColor: '#003366', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
                    <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Loading events...</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            ) : events.length === 0 ? (
                <div className="glass-card" style={{ padding: '60px 20px', textAlign: 'center' }}>
                    <Calendar size={48} color="#94A3B8" style={{ margin: '0 auto 16px' }} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', marginBottom: '8px' }}>No events found</h3>
                    <p style={{ color: '#64748B', fontSize: '0.85rem' }}>Try adjusting your filters or check back later for new events.</p>
                </div>
            ) : (
                <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
                    {events.map((event) => (
                        <EventCard
                            key={event._id}
                            event={event}
                            onRegister={handleRegister}
                            isRegistered={event.registeredUsers?.includes(user?._id)}
                            userId={user?._id}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function MiniStat({ icon, label, value, color }) {
    return (
        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
                {icon}
            </div>
            <div>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E293B', lineHeight: 1 }}>{value}</p>
                <p style={{ fontSize: '0.75rem', color: '#64748B' }}>{label}</p>
            </div>
        </div>
    );
}
