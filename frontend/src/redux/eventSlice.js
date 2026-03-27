import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const fetchEvents = createAsyncThunk('events/fetchAll', async (filters = {}, { rejectWithValue }) => {
    try {
        const params = new URLSearchParams();
        if (filters.department) params.append('department', filters.department);
        if (filters.status) params.append('status', filters.status);
        if (filters.eventType) params.append('eventType', filters.eventType);
        if (filters.search) params.append('search', filters.search);
        const { data } = await api.get(`/events?${params.toString()}`);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
    }
});

export const fetchMyEvents = createAsyncThunk('events/fetchMy', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/events/my-events');
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch your events');
    }
});

export const fetchEventById = createAsyncThunk('events/fetchById', async (id, { rejectWithValue }) => {
    try {
        const { data } = await api.get(`/events/${id}`);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch event');
    }
});

export const createEvent = createAsyncThunk('events/create', async (eventData, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/events', eventData);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create event');
    }
});

export const updateEvent = createAsyncThunk('events/update', async ({ id, eventData }, { rejectWithValue }) => {
    try {
        const { data } = await api.put(`/events/${id}`, eventData);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update event');
    }
});

export const deleteEvent = createAsyncThunk('events/delete', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/events/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete event');
    }
});

export const registerForEvent = createAsyncThunk('events/register', async (id, { rejectWithValue }) => {
    try {
        const { data } = await api.post(`/events/${id}/register`);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
});

export const unregisterFromEvent = createAsyncThunk('events/unregister', async (id, { rejectWithValue }) => {
    try {
        const { data } = await api.post(`/events/${id}/unregister`);
        return { id, ...data };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Unregistration failed');
    }
});

export const fetchRegistrations = createAsyncThunk('events/fetchRegistrations', async (id, { rejectWithValue }) => {
    try {
        const { data } = await api.get(`/events/${id}/registrations`);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch registrations');
    }
});

const eventSlice = createSlice({
    name: 'events',
    initialState: {
        events: [],
        myEvents: [],
        currentEvent: null,
        registrations: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearEventError(state) { state.error = null; },
        clearCurrentEvent(state) { state.currentEvent = null; },
        clearRegistrations(state) { state.registrations = null; },
    },
    extraReducers: (builder) => {
        // Fetch all
        builder.addCase(fetchEvents.pending, (state) => { state.loading = true; state.error = null; });
        builder.addCase(fetchEvents.fulfilled, (state, action) => { state.loading = false; state.events = action.payload; });
        builder.addCase(fetchEvents.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
        // Fetch my events
        builder.addCase(fetchMyEvents.pending, (state) => { state.loading = true; });
        builder.addCase(fetchMyEvents.fulfilled, (state, action) => { state.loading = false; state.myEvents = action.payload; });
        builder.addCase(fetchMyEvents.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
        // Fetch by ID
        builder.addCase(fetchEventById.fulfilled, (state, action) => { state.currentEvent = action.payload; });
        // Create
        builder.addCase(createEvent.fulfilled, (state, action) => { state.events.unshift(action.payload); });
        // Update
        builder.addCase(updateEvent.fulfilled, (state, action) => {
            const idx = state.events.findIndex((e) => e._id === action.payload._id);
            if (idx !== -1) state.events[idx] = action.payload;
        });
        // Delete
        builder.addCase(deleteEvent.fulfilled, (state, action) => {
            state.events = state.events.filter((e) => e._id !== action.payload);
        });
        // Register
        builder.addCase(registerForEvent.fulfilled, (state, action) => {
            if (action.payload.event) {
                const idx = state.events.findIndex((e) => e._id === action.payload.event._id);
                if (idx !== -1) state.events[idx] = action.payload.event;
            }
        });
        // Unregister
        builder.addCase(unregisterFromEvent.fulfilled, (state, action) => {
            state.myEvents = state.myEvents.filter((e) => e._id !== action.payload.id);
        });
        // Registrations
        builder.addCase(fetchRegistrations.fulfilled, (state, action) => { state.registrations = action.payload; });
    },
});

export const { clearEventError, clearCurrentEvent, clearRegistrations } = eventSlice.actions;
export default eventSlice.reducer;
