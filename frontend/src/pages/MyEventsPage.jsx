import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyEvents, unregisterFromEvent } from '../redux/eventSlice';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, MapPin, Clock, Tag, QrCode, X } from 'lucide-react';
import { toast } from 'react-toastify';

export default function MyEventsPage() {
    const dispatch = useDispatch();
    const { myEvents, loading } = useSelector((state) => state.events);
    const { user } = useSelector((state) => state.auth);
    const [selectedQR, setSelectedQR] = useState(null);

    useEffect(() => {
        dispatch(fetchMyEvents());
    }, [dispatch]);

    const handleUnregister = async (eventId) => {
        if (window.confirm('Are you sure you want to unregister from this event?')) {
            const result = await dispatch(unregisterFromEvent(eventId));
            if (unregisterFromEvent.fulfilled.match(result)) {
                toast.success('Successfully unregistered from event.');
            } else {
                toast.error(result.payload || 'Failed to unregister');
            }
        }
    };

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
            <div className="animate-fadeInUp" style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E293B', marginBottom: '4px' }}>My Registered Events</h1>
                <p style={{ color: '#64748B', fontSize: '0.9rem' }}>View your registrations and QR codes for attendance</p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid #E2E8F0', borderTopColor: '#003366', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            ) : myEvents.length === 0 ? (
                <div className="glass-card" style={{ padding: '60px 20px', textAlign: 'center' }}>
                    <Calendar size={48} color="#94A3B8" style={{ margin: '0 auto 16px' }} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', marginBottom: '8px' }}>No registered events</h3>
                    <p style={{ color: '#64748B', fontSize: '0.85rem' }}>Browse events and register to see them here.</p>
                </div>
            ) : (
                <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {myEvents.map((event) => {
                        const eventDate = new Date(event.date);
                        return (
                            <div key={event._id} className="glass-card glass-card-hover" style={{ display: 'flex', overflow: 'hidden' }}>
                                {/* Left color stripe */}
                                <div style={{
                                    width: '6px',
                                    background: event.status === 'Completed'
                                        ? 'linear-gradient(180deg, #003366, #004a99)'
                                        : event.status === 'Ongoing'
                                            ? 'linear-gradient(180deg, #10B981, #34D399)'
                                            : 'linear-gradient(180deg, #FFD700, #FFE44D)',
                                }} />

                                {/* Content */}
                                <div style={{ flex: 1, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
                                    <div style={{ flex: 1, minWidth: '200px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1E293B' }}>{event.title}</h3>
                                            <span className={`badge ${event.status === 'Upcoming' ? 'badge-upcoming' : event.status === 'Ongoing' ? 'badge-ongoing' : 'badge-completed'}`}>
                                                {event.status}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.8rem', color: '#64748B' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={13} /> {eventDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={13} /> {eventDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={13} /> {event.venue}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Tag size={13} /> {event.department}</span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <button
                                            onClick={() => setSelectedQR(event)}
                                            className="btn-secondary"
                                            style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                                        >
                                            <QrCode size={16} /> View QR
                                        </button>
                                        {event.status !== 'Completed' && (
                                            <button
                                                onClick={() => handleUnregister(event._id)}
                                                className="btn-danger"
                                                style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                                            >
                                                Unregister
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* QR Modal */}
            {selectedQR && (
                <div className="modal-overlay" onClick={() => setSelectedQR(null)}>
                    <div className="modal-content" style={{ maxWidth: '400px', padding: '32px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setSelectedQR(null)} style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#94A3B8',
                        }}>
                            <X size={20} />
                        </button>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1E293B', marginBottom: '8px' }}>
                            Attendance QR Code
                        </h3>
                        <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '24px' }}>
                            Show this QR code at the venue for {selectedQR.title}
                        </p>
                        <div style={{
                            background: 'white',
                            padding: '24px',
                            borderRadius: '16px',
                            border: '2px solid #E2E8F0',
                            display: 'inline-block',
                            marginBottom: '20px',
                        }}>
                            <QRCodeSVG
                                value={JSON.stringify({
                                    eventId: selectedQR._id,
                                    eventTitle: selectedQR.title,
                                    userId: user?._id,
                                    userName: user?.name,
                                    rollNumber: user?.rollNumber,
                                })}
                                size={200}
                                bgColor="#FFFFFF"
                                fgColor="#003366"
                                level="H"
                            />
                        </div>
                        <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '10px' }}>
                            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E293B' }}>{user?.name}</p>
                            <p style={{ fontSize: '0.75rem', color: '#64748B' }}>{user?.rollNumber} • {user?.department}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
