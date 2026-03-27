import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// Async thunks
export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/auth/login', credentials);
        localStorage.setItem('sece_token', data.token);
        localStorage.setItem('sece_user', JSON.stringify(data.user));
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
});

export const signupUser = createAsyncThunk('auth/signup', async (userData, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/auth/signup', userData);
        localStorage.setItem('sece_token', data.token);
        localStorage.setItem('sece_user', JSON.stringify(data.user));
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Signup failed');
    }
});

export const fetchCurrentUser = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/auth/me');
        return data.user;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Session expired');
    }
});

// Read from localStorage on init
const savedUser = localStorage.getItem('sece_user');
const savedToken = localStorage.getItem('sece_token');

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: savedUser ? JSON.parse(savedUser) : null,
        token: savedToken || null,
        loading: false,
        error: null,
    },
    reducers: {
        logout(state) {
            state.user = null;
            state.token = null;
            state.error = null;
            localStorage.removeItem('sece_token');
            localStorage.removeItem('sece_user');
        },
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Login
        builder.addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; });
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
        });
        builder.addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
        // Signup
        builder.addCase(signupUser.pending, (state) => { state.loading = true; state.error = null; });
        builder.addCase(signupUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
        });
        builder.addCase(signupUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
        // Fetch me
        builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
            state.user = action.payload;
        });
        builder.addCase(fetchCurrentUser.rejected, (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('sece_token');
            localStorage.removeItem('sece_user');
        });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
