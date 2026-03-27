import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchEvents, registerForEvent } from '../redux/eventSlice';
import EventCard from '../components/EventCard';
import { Search, Filter, Calendar, SlidersHorizontal } from 'lucide-react';
import { toast } from 'react-toastify';

const DEPARTMENTS = ['All Departments', 'CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AI&DS', 'IT', 'BME', 'Placement Cell'];
const STATUSES = ['All', 'Upcoming', 'Ongoing', 'Completed'];
const EVENT_TYPES = ['All', 'Symposium', 'Workshop', 'Sports', 'Cultural', 'Seminar', 'Hackathon', 'Guest Lecture', 'Other'];

export default function EventsPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
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
        if (!user) {
            navigate('/login');
            return;
        }
        const result = await dispatch(registerForEvent(eventId));
        if (registerForEvent.fulfilled.match(result)) {
            toast.success('🎉 Successfully registered!');
            dispatch(fetchEvents({}));
        } else {
            toast.error(result.payload || 'Registration failed');
        }
    };

    return (
        <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '32px 24px' }}>
            <div className="animate-fadeInUp" style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E293B', marginBottom: '4px' }}>All Events</h1>
                <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Browse all SECE events across departments</p>
            </div>

            {/* Search & Filter */}
            <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                        <input className="input-field" placeholder="Search events..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} style={{ paddingLeft: '42px', border: '1.5px solid #E2E8F0' }} />
                    </div>
                    <select className="select-field" style={{ width: 'auto', minWidth: '160px' }} value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value })}>
                        {DEPARTMENTS.map((d) => <option key={d} value={d === 'All Departments' ? '' : d}>{d}</option>)}
                    </select>
                    <select className="select-field" style={{ width: 'auto', minWidth: '120px' }} value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                        {STATUSES.map((s) => <option key={s} value={s === 'All' ? '' : s}>{s}</option>)}
                    </select>
                    <select className="select-field" style={{ width: 'auto', minWidth: '130px' }} value={filters.eventType} onChange={(e) => setFilters({ ...filters, eventType: e.target.value })}>
                        {EVENT_TYPES.map((t) => <option key={t} value={t === 'All' ? '' : t}>{t}</option>)}
                    </select>
                </div>
            </div>

            {/* Events Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid #E2E8F0', borderTopColor: '#003366', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
                    <p style={{ color: '#64748B' }}>Loading events...</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            ) : events.length === 0 ? (
                <div className="glass-card" style={{ padding: '60px 20px', textAlign: 'center' }}>
                    <Calendar size={48} color="#94A3B8" style={{ margin: '0 auto 16px' }} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', marginBottom: '8px' }}>No events found</h3>
                    <p style={{ color: '#64748B', fontSize: '0.85rem' }}>Try adjusting your filters.</p>
                </div>
            ) : (
                <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
                    {events.map((event) => (
                        <EventCard
                            key={event._id}
                            event={event}
                            onRegister={handleRegister}
                            isRegistered={user && event.registeredUsers?.includes(user._id)}
                            userId={user?._id}
                            showActions={user?.role === 'student'}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
