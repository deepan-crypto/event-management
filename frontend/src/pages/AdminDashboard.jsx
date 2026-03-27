import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents, createEvent, updateEvent, deleteEvent, fetchRegistrations, clearRegistrations } from '../redux/eventSlice';
import { Plus, Edit3, Trash2, Users, Calendar, Eye, X, TrendingUp, BarChart3, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';

const DEPARTMENTS = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AI&DS', 'IT', 'BME', 'Placement Cell', 'All Departments'];
const EVENT_TYPES = ['Symposium', 'Workshop', 'Sports', 'Cultural', 'Seminar', 'Hackathon', 'Guest Lecture', 'Other'];
const STATUSES = ['Upcoming', 'Ongoing', 'Completed'];
const VENUES = ['Seminar Hall 1', 'Seminar Hall 2', 'Open Auditorium', 'Main Auditorium', 'Conference Room A', 'Sports Ground', 'Indoor Stadium', 'Library Hall', 'Lab Complex', 'Other'];

const emptyForm = {
    title: '', description: '', date: '', endDate: '', venue: '', department: '',
    organizerName: '', maxCapacity: 100, eventType: 'Other', status: 'Upcoming', poster: '',
};

export default function AdminDashboard() {
    const dispatch = useDispatch();
    const { events, registrations, loading } = useSelector((state) => state.events);
    const { user } = useSelector((state) => state.auth);
    const [showForm, setShowForm] = useState(false);
    const [showRegs, setShowRegs] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({ ...emptyForm });
    const [tab, setTab] = useState('all');

    useEffect(() => {
        dispatch(fetchEvents({}));
    }, [dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let result;
        if (editId) {
            result = await dispatch(updateEvent({ id: editId, eventData: form }));
            if (updateEvent.fulfilled.match(result)) {
                toast.success('Event updated successfully!');
            } else {
                toast.error(result.payload || 'Update failed');
                return;
            }
        } else {
            result = await dispatch(createEvent(form));
            if (createEvent.fulfilled.match(result)) {
                toast.success('🎉 Event created successfully!');
            } else {
                toast.error(result.payload || 'Creation failed');
                return;
            }
        }
        setShowForm(false);
        setEditId(null);
        setForm({ ...emptyForm });
        dispatch(fetchEvents({}));
    };

    const handleEdit = (event) => {
        setEditId(event._id);
        setForm({
            title: event.title,
            description: event.description || '',
            date: event.date?.split('T')[0] || '',
            endDate: event.endDate?.split('T')[0] || '',
            venue: event.venue,
            department: event.department,
            organizerName: event.organizerName,
            maxCapacity: event.maxCapacity,
            eventType: event.eventType,
            status: event.status,
            poster: event.poster || '',
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            const result = await dispatch(deleteEvent(id));
            if (deleteEvent.fulfilled.match(result)) {
                toast.success('Event deleted.');
            } else {
                toast.error(result.payload || 'Delete failed');
            }
        }
    };

    const viewRegistrations = (eventId) => {
        dispatch(fetchRegistrations(eventId));
        setShowRegs(true);
    };

    const filteredEvents = tab === 'all' ? events : events.filter((e) => e.status === tab);
    const totalRegistrations = events.reduce((sum, e) => sum + (e.registeredUsers?.length || 0), 0);

    return (
        <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '32px 24px' }}>
            {/* Header */}
            <div className="animate-fadeInUp" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E293B', marginBottom: '4px' }}>Admin Dashboard</h1>
                    <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Manage events, view registrations, and track participation</p>
                </div>
                <button onClick={() => { setShowForm(true); setEditId(null); setForm({ ...emptyForm }); }} className="btn-primary" style={{ padding: '12px 24px' }}>
                    <Plus size={18} /> Create New Event
                </button>
            </div>

            {/* Stats */}
            <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
                <AdminStat icon={<Calendar size={22} />} label="Total Events" value={events.length} color="#003366" />
                <AdminStat icon={<TrendingUp size={22} />} label="Upcoming" value={events.filter((e) => e.status === 'Upcoming').length} color="#F59E0B" />
                <AdminStat icon={<Sparkles size={22} />} label="Ongoing" value={events.filter((e) => e.status === 'Ongoing').length} color="#10B981" />
                <AdminStat icon={<Users size={22} />} label="Total Registrations" value={totalRegistrations} color="#7C3AED" />
            </div>

            {/* Tab Filter */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: '#F1F5F9', borderRadius: '10px', padding: '4px', width: 'fit-content' }}>
                {['all', 'Upcoming', 'Ongoing', 'Completed'].map((t) => (
                    <button key={t} onClick={() => setTab(t)} style={{
                        padding: '8px 20px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        transition: 'all 0.2s',
                        background: tab === t ? '#003366' : 'transparent',
                        color: tab === t ? 'white' : '#64748B',
                        textTransform: 'capitalize',
                    }}>
                        {t === 'all' ? 'All Events' : t}
                    </button>
                ))}
            </div>

            {/* Events Table */}
            <div className="glass-card" style={{ overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                                {['Event', 'Department', 'Date', 'Venue', 'Type', 'Status', 'Registrations', 'Actions'].map((h) => (
                                    <th key={h} style={{ padding: '14px 16px', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEvents.length === 0 ? (
                                <tr><td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>No events found</td></tr>
                            ) : filteredEvents.map((event) => (
                                <tr key={event._id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.2s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#FAFBFF'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                                >
                                    <td style={{ padding: '14px 16px' }}>
                                        <p style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1E293B' }}>{event.title}</p>
                                        <p style={{ fontSize: '0.75rem', color: '#94A3B8' }}>by {event.organizerName}</p>
                                    </td>
                                    <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: '#475569' }}>{event.department}</td>
                                    <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: '#475569' }}>
                                        {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                    </td>
                                    <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: '#475569' }}>{event.venue}</td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <span style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600, background: '#EEF2FF', color: '#4F46E5' }}>{event.eventType}</span>
                                    </td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <span className={`badge ${event.status === 'Upcoming' ? 'badge-upcoming' : event.status === 'Ongoing' ? 'badge-ongoing' : 'badge-completed'}`}>
                                            {event.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <span style={{ fontWeight: 700, color: '#1E293B', fontSize: '0.9rem' }}>{event.registeredUsers?.length || 0}</span>
                                        <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}> / {event.maxCapacity}</span>
                                    </td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <ActionBtn icon={<Eye size={14} />} color="#3B82F6" onClick={() => viewRegistrations(event._id)} title="View Registrations" />
                                            <ActionBtn icon={<Edit3 size={14} />} color="#F59E0B" onClick={() => handleEdit(event)} title="Edit" />
                                            <ActionBtn icon={<Trash2 size={14} />} color="#EF4444" onClick={() => handleDelete(event._id)} title="Delete" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {showForm && (
                <div className="modal-overlay" onClick={() => { setShowForm(false); setEditId(null); }}>
                    <div className="modal-content" style={{ maxWidth: '640px', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ padding: '24px 28px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1E293B' }}>{editId ? 'Edit Event' : 'Create New Event'}</h3>
                            <button onClick={() => { setShowForm(false); setEditId(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ padding: '24px 28px' }}>
                            <div style={{ display: 'grid', gap: '16px' }}>
                                <FormField label="Event Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
                                <FormField label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} textarea />

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                    <FormField label="Start Date" type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} required />
                                    <FormField label="End Date" type="date" value={form.endDate} onChange={(v) => setForm({ ...form, endDate: v })} />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Venue</label>
                                        <select className="select-field" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} required>
                                            <option value="">Select venue</option>
                                            {VENUES.map((v) => <option key={v} value={v}>{v}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Department</label>
                                        <select className="select-field" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required>
                                            <option value="">Select department</option>
                                            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Event Type</label>
                                        <select className="select-field" value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })}>
                                            {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Status</label>
                                        <select className="select-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                                            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                    <FormField label="Organizer Name" value={form.organizerName} onChange={(v) => setForm({ ...form, organizerName: v })} required />
                                    <FormField label="Max Capacity" type="number" value={form.maxCapacity} onChange={(v) => setForm({ ...form, maxCapacity: parseInt(v) || 0 })} required />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #E2E8F0' }}>
                                <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="btn-outline" style={{ padding: '10px 24px' }}>Cancel</button>
                                <button type="submit" className="btn-primary" style={{ padding: '10px 24px' }}>
                                    {editId ? 'Update Event' : 'Create Event'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Registrations Modal */}
            {showRegs && (
                <div className="modal-overlay" onClick={() => { setShowRegs(false); dispatch(clearRegistrations()); }}>
                    <div className="modal-content" style={{ maxWidth: '700px' }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ padding: '24px 28px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1E293B' }}>
                                    {registrations?.eventTitle || 'Event'} — Registrations
                                </h3>
                                <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
                                    {registrations?.totalRegistered || 0} / {registrations?.maxCapacity || 0} registered
                                </p>
                            </div>
                            <button onClick={() => { setShowRegs(false); dispatch(clearRegistrations()); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><X size={20} /></button>
                        </div>
                        <div style={{ padding: '20px 28px', maxHeight: '400px', overflow: 'auto' }}>
                            {registrations?.registrations?.length > 0 ? (
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid #E2E8F0' }}>
                                            {['#', 'Name', 'Roll Number', 'Department', 'Email'].map((h) => (
                                                <th key={h} style={{ padding: '10px 12px', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textAlign: 'left' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {registrations.registrations.map((r, i) => (
                                            <tr key={r._id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                                <td style={{ padding: '10px 12px', fontSize: '0.8rem', color: '#94A3B8' }}>{i + 1}</td>
                                                <td style={{ padding: '10px 12px', fontSize: '0.85rem', fontWeight: 600, color: '#1E293B' }}>{r.name}</td>
                                                <td style={{ padding: '10px 12px', fontSize: '0.85rem', color: '#475569' }}>{r.rollNumber || '-'}</td>
                                                <td style={{ padding: '10px 12px', fontSize: '0.85rem', color: '#475569' }}>{r.department}</td>
                                                <td style={{ padding: '10px 12px', fontSize: '0.85rem', color: '#475569' }}>{r.email}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>No registrations yet</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function AdminStat({ icon, label, value, color }) {
    return (
        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>{icon}</div>
            <div>
                <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1E293B', lineHeight: 1 }}>{value}</p>
                <p style={{ fontSize: '0.75rem', color: '#64748B' }}>{label}</p>
            </div>
        </div>
    );
}

function ActionBtn({ icon, color, onClick, title }) {
    return (
        <button title={title} onClick={onClick} style={{
            width: '32px', height: '32px', borderRadius: '8px', background: `${color}10`,
            border: 'none', cursor: 'pointer', color, display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
        }}
            onMouseEnter={(e) => { e.currentTarget.style.background = `${color}20`; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = `${color}10`; }}
        >
            {icon}
        </button>
    );
}

function FormField({ label, value, onChange, type = 'text', required, textarea }) {
    return (
        <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>{label}</label>
            {textarea ? (
                <textarea
                    className="input-field"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    rows={3}
                    style={{ resize: 'vertical' }}
                />
            ) : (
                <input
                    type={type}
                    className="input-field"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required={required}
                />
            )}
        </div>
    );
}
