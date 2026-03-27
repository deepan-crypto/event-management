import React from 'react';
import { Calendar, MapPin, Users, Tag, Clock } from 'lucide-react';

const STATUS_CLASSES = {
    Upcoming: 'badge-upcoming',
    Ongoing: 'badge-ongoing',
    Completed: 'badge-completed',
};

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

export default function EventCard({ event, onRegister, onUnregister, isRegistered, showActions = true, userId }) {
    const eventDate = new Date(event.date);
    const isFullCapacity = event.registeredUsers?.length >= event.maxCapacity;
    const spotsLeft = event.maxCapacity - (event.registeredUsers?.length || 0);
    const typeColor = TYPE_COLORS[event.eventType] || TYPE_COLORS.Other;

    return (
        <div className="glass-card glass-card-hover" style={{ overflow: 'hidden' }}>
            {/* Type ribbon */}
            <div style={{
                background: typeColor,
                padding: '6px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <span style={{ color: 'white', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {event.eventType}
                </span>
                <span className={`badge ${STATUS_CLASSES[event.status] || 'badge-upcoming'}`} style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                    {event.status}
                </span>
            </div>

            <div style={{ padding: '20px' }}>
                {/* Title */}
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', marginBottom: '8px', lineHeight: 1.3 }}>
                    {event.title}
                </h3>

                {/* Description */}
                {event.description && (
                    <p style={{
                        fontSize: '0.8rem',
                        color: '#64748B',
                        marginBottom: '16px',
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}>
                        {event.description}
                    </p>
                )}

                {/* Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    <DetailRow icon={<Calendar size={14} />} text={eventDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} />
                    <DetailRow icon={<Clock size={14} />} text={eventDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} />
                    <DetailRow icon={<MapPin size={14} />} text={event.venue} />
                    <DetailRow icon={<Tag size={14} />} text={event.department} color={typeColor} />
                    <DetailRow icon={<Users size={14} />} text={`${event.registeredUsers?.length || 0} / ${event.maxCapacity} registered`} color={isFullCapacity ? '#EF4444' : '#10B981'} />
                </div>

                {/* Organizer */}
                <div style={{
                    padding: '10px 14px',
                    background: '#F8FAFC',
                    borderRadius: '8px',
                    marginBottom: '16px',
                }}>
                    <p style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Organized by</p>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1E293B' }}>{event.organizerName}</p>
                </div>

                {/* Spots left */}
                {event.status !== 'Completed' && (
                    <div style={{ marginBottom: '16px' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '6px',
                            fontSize: '0.75rem',
                            color: '#64748B',
                        }}>
                            <span>Spots filled</span>
                            <span style={{ fontWeight: 600 }}>{spotsLeft} left</span>
                        </div>
                        <div style={{
                            height: '6px',
                            background: '#E2E8F0',
                            borderRadius: '3px',
                            overflow: 'hidden',
                        }}>
                            <div style={{
                                height: '100%',
                                width: `${Math.min(((event.registeredUsers?.length || 0) / event.maxCapacity) * 100, 100)}%`,
                                background: isFullCapacity
                                    ? 'linear-gradient(90deg, #EF4444, #F87171)'
                                    : 'linear-gradient(90deg, #003366, #004a99)',
                                borderRadius: '3px',
                                transition: 'width 0.5s ease',
                            }} />
                        </div>
                    </div>
                )}

                {/* Actions */}
                {showActions && event.status !== 'Completed' && (
                    <div>
                        {isRegistered ? (
                            <button
                                onClick={() => onUnregister && onUnregister(event._id)}
                                className="btn-outline"
                                style={{ width: '100%', justifyContent: 'center', borderColor: '#EF4444', color: '#EF4444', fontSize: '0.8rem' }}
                            >
                                Unregister
                            </button>
                        ) : (
                            <button
                                onClick={() => onRegister && onRegister(event._id)}
                                className="btn-primary"
                                style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}
                                disabled={isFullCapacity}
                            >
                                {isFullCapacity ? 'Event Full' : 'Register Now'}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function DetailRow({ icon, text, color }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: color || '#64748B', flexShrink: 0 }}>{icon}</span>
            <span style={{ fontSize: '0.8rem', color: '#475569' }}>{text}</span>
        </div>
    );
}
