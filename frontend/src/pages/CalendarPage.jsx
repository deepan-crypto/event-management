import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchEvents, registerForEvent } from '../redux/eventSlice';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Clock, Users, Tag, Sparkles, X } from 'lucide-react';
import { toast } from 'react-toastify';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const TYPE_COLORS = {
    Symposium: '#7C3AED',
    Workshop: '#0891B2',
    Sports: '#16A34A',
    Cultural: '#DB2777',
    Seminar: '#EA580C',
    Hackathon: '#2563EB',
    'Guest Lecture': '#4F46E5',
    Other: '#64748B',
};

const STATUS_STYLES = {
    Upcoming: { bg: 'rgba(255, 215, 0, 0.15)', color: '#B8860B', border: 'rgba(255, 215, 0, 0.3)' },
    Ongoing: { bg: 'rgba(16, 185, 129, 0.1)', color: '#059669', border: 'rgba(16, 185, 129, 0.3)' },
    Completed: { bg: 'rgba(0, 51, 102, 0.1)', color: '#003366', border: 'rgba(0, 51, 102, 0.2)' },
};

export default function CalendarPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { events, loading } = useSelector((state) => state.events);
    const { user } = useSelector((state) => state.auth);

    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        dispatch(fetchEvents({}));
    }, [dispatch]);

    // Group events by date string (YYYY-MM-DD)
    const eventsByDate = useMemo(() => {
        const map = {};
        events.forEach((event) => {
            const d = new Date(event.date);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            if (!map[key]) map[key] = [];
            map[key].push(event);
        });
        return map;
    }, [events]);

    // Calendar grid computation
    const calendarDays = useMemo(() => {
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

        const cells = [];

        // Previous month trailing days
        for (let i = firstDay - 1; i >= 0; i--) {
            cells.push({ day: daysInPrevMonth - i, isCurrentMonth: false, isPrev: true });
        }

        // Current month days
        for (let d = 1; d <= daysInMonth; d++) {
            const key = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            cells.push({
                day: d,
                isCurrentMonth: true,
                dateKey: key,
                events: eventsByDate[key] || [],
                isToday: d === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear(),
            });
        }

        // Next month leading days to fill grid
        const remaining = 42 - cells.length;
        for (let d = 1; d <= remaining; d++) {
            cells.push({ day: d, isCurrentMonth: false, isNext: true });
        }

        return cells;
    }, [currentMonth, currentYear, eventsByDate, today]);

    const selectedEvents = selectedDate ? (eventsByDate[selectedDate] || []) : [];

    const goToPrev = () => {
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
        else setCurrentMonth(currentMonth - 1);
        setSelectedDate(null);
    };

    const goToNext = () => {
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
        else setCurrentMonth(currentMonth + 1);
        setSelectedDate(null);
    };

    const goToToday = () => {
        setCurrentMonth(today.getMonth());
        setCurrentYear(today.getFullYear());
        const key = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        setSelectedDate(key);
    };

    const handleRegister = async (eventId) => {
        if (!user) { navigate('/login'); return; }
        const result = await dispatch(registerForEvent(eventId));
        if (registerForEvent.fulfilled.match(result)) {
            toast.success('🎉 Successfully registered!');
            dispatch(fetchEvents({}));
        } else {
            toast.error(result.payload || 'Registration failed');
        }
    };

    const formatSelectedDate = (dateKey) => {
        if (!dateKey) return '';
        const [y, m, d] = dateKey.split('-').map(Number);
        return new Date(y, m - 1, d).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '32px 24px' }}>
            {/* Header */}
            <div className="animate-fadeInUp" style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Calendar size={20} color="#003366" />
                    <span style={{ fontSize: '0.85rem', color: '#003366', fontWeight: 600 }}>Event Calendar</span>
                </div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E293B', marginBottom: '4px' }}>
                    Calendar View
                </h1>
                <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Click on any date to see scheduled events</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: selectedDate ? '1fr 380px' : '1fr', gap: '24px', transition: 'all 0.3s ease' }}
                className="calendar-layout"
            >
                {/* Calendar Card */}
                <div className="glass-card animate-fadeInUp" style={{ padding: '24px', overflow: 'hidden' }}>
                    {/* Month Navigation */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <button onClick={goToPrev} className="calendar-nav-btn" aria-label="Previous month">
                                <ChevronLeft size={20} />
                            </button>
                            <button onClick={goToNext} className="calendar-nav-btn" aria-label="Next month">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1E293B' }}>
                            {MONTHS[currentMonth]} {currentYear}
                        </h2>
                        <button onClick={goToToday} className="btn-outline" style={{ padding: '6px 16px', fontSize: '0.78rem', borderWidth: '1.5px' }}>
                            Today
                        </button>
                    </div>

                    {/* Day Headers */}
                    <div className="calendar-grid" style={{ marginBottom: '4px' }}>
                        {DAYS.map((day) => (
                            <div key={day} style={{
                                textAlign: 'center',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                color: '#94A3B8',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                padding: '8px 0',
                            }}>
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                            <div style={{ width: '40px', height: '40px', border: '3px solid #E2E8F0', borderTopColor: '#003366', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
                            <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Loading calendar...</p>
                            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                        </div>
                    ) : (
                        <div className="calendar-grid">
                            {calendarDays.map((cell, idx) => {
                                const isSelected = cell.dateKey && cell.dateKey === selectedDate;
                                const hasEvents = cell.events && cell.events.length > 0;
                                return (
                                    <div
                                        key={idx}
                                        onClick={() => cell.isCurrentMonth && setSelectedDate(cell.dateKey === selectedDate ? null : cell.dateKey)}
                                        className={`calendar-cell ${cell.isCurrentMonth ? 'calendar-cell-current' : 'calendar-cell-other'} ${cell.isToday ? 'calendar-cell-today' : ''} ${isSelected ? 'calendar-cell-selected' : ''}`}
                                        style={{ cursor: cell.isCurrentMonth ? 'pointer' : 'default' }}
                                    >
                                        <span className="calendar-day-number">{cell.day}</span>
                                        {hasEvents && (
                                            <div className="calendar-dots">
                                                {cell.events.slice(0, 3).map((ev, i) => (
                                                    <span
                                                        key={i}
                                                        className="calendar-dot"
                                                        style={{ background: TYPE_COLORS[ev.eventType] || TYPE_COLORS.Other }}
                                                    />
                                                ))}
                                                {cell.events.length > 3 && (
                                                    <span style={{ fontSize: '0.6rem', color: '#64748B', fontWeight: 600 }}>+{cell.events.length - 3}</span>
                                                )}
                                            </div>
                                        )}
                                        {hasEvents && (
                                            <span className="calendar-event-count">
                                                {cell.events.length}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Legend */}
                    <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
                        <p style={{ fontSize: '0.7rem', color: '#94A3B8', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Event Types</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                            {Object.entries(TYPE_COLORS).map(([type, color]) => (
                                <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                                    <span style={{ fontSize: '0.7rem', color: '#64748B' }}>{type}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Event Detail Panel */}
                {selectedDate && (
                    <div className="animate-slideInRight" style={{ alignSelf: 'start', position: 'sticky', top: '88px' }}>
                        <div className="glass-card" style={{ overflow: 'hidden' }}>
                            {/* Panel Header */}
                            <div style={{
                                background: 'linear-gradient(135deg, #003366 0%, #004a99 100%)',
                                padding: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                                <div>
                                    <p style={{ color: 'rgba(255,215,0,0.85)', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                                        Events on
                                    </p>
                                    <h3 style={{ color: 'white', fontSize: '1rem', fontWeight: 700 }}>
                                        {formatSelectedDate(selectedDate)}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setSelectedDate(null)}
                                    style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: 'white', display: 'flex' }}
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Event List */}
                            <div style={{ padding: '16px', maxHeight: 'calc(100vh - 240px)', overflowY: 'auto' }}>
                                {selectedEvents.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '40px 16px' }}>
                                        <Calendar size={40} color="#CBD5E1" style={{ margin: '0 auto 12px' }} />
                                        <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#94A3B8', marginBottom: '4px' }}>No events</p>
                                        <p style={{ fontSize: '0.78rem', color: '#CBD5E1' }}>No events scheduled on this date</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {selectedEvents.map((event) => {
                                            const typeColor = TYPE_COLORS[event.eventType] || TYPE_COLORS.Other;
                                            const statusStyle = STATUS_STYLES[event.status] || STATUS_STYLES.Upcoming;
                                            const eventDate = new Date(event.date);
                                            const isRegistered = user && event.registeredUsers?.includes(user._id);
                                            const isFull = event.registeredUsers?.length >= event.maxCapacity;

                                            return (
                                                <div
                                                    key={event._id}
                                                    style={{
                                                        border: '1px solid #E2E8F0',
                                                        borderRadius: '12px',
                                                        overflow: 'hidden',
                                                        transition: 'all 0.2s ease',
                                                    }}
                                                    className="glass-card-hover"
                                                >
                                                    {/* Type strip */}
                                                    <div style={{ background: typeColor, height: '4px' }} />

                                                    <div style={{ padding: '14px' }}>
                                                        {/* Status + Type row */}
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                            <span style={{
                                                                fontSize: '0.65rem',
                                                                fontWeight: 600,
                                                                color: typeColor,
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.05em',
                                                            }}>
                                                                {event.eventType}
                                                            </span>
                                                            <span style={{
                                                                fontSize: '0.6rem',
                                                                fontWeight: 600,
                                                                padding: '2px 8px',
                                                                borderRadius: '9999px',
                                                                background: statusStyle.bg,
                                                                color: statusStyle.color,
                                                                border: `1px solid ${statusStyle.border}`,
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.04em',
                                                            }}>
                                                                {event.status}
                                                            </span>
                                                        </div>

                                                        {/* Title */}
                                                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', marginBottom: '10px', lineHeight: 1.3 }}>
                                                            {event.title}
                                                        </h4>

                                                        {/* Details */}
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                                                            <MiniDetail icon={<Clock size={13} />} text={eventDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} />
                                                            <MiniDetail icon={<MapPin size={13} />} text={event.venue} />
                                                            <MiniDetail icon={<Tag size={13} />} text={event.department} />
                                                            <MiniDetail icon={<Users size={13} />} text={`${event.registeredUsers?.length || 0} / ${event.maxCapacity}`} color={isFull ? '#EF4444' : '#10B981'} />
                                                        </div>

                                                        {/* Register button */}
                                                        {user?.role === 'student' && event.status !== 'Completed' && (
                                                            <button
                                                                onClick={() => handleRegister(event._id)}
                                                                disabled={isRegistered || isFull}
                                                                className={isRegistered ? 'btn-outline' : 'btn-primary'}
                                                                style={{
                                                                    width: '100%',
                                                                    justifyContent: 'center',
                                                                    fontSize: '0.78rem',
                                                                    padding: '8px 16px',
                                                                    ...(isRegistered ? { borderColor: '#10B981', color: '#10B981', cursor: 'default' } : {}),
                                                                }}
                                                            >
                                                                {isRegistered ? '✓ Registered' : isFull ? 'Event Full' : 'Register'}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function MiniDetail({ icon, text, color }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: color || '#94A3B8', flexShrink: 0 }}>{icon}</span>
            <span style={{ fontSize: '0.78rem', color: '#475569' }}>{text}</span>
        </div>
    );
}
