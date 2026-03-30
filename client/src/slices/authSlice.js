import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authApi from "../api/authApi";

// Initialize state from local storage securely
const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
const token = localStorage.getItem('token') || null;

// --- Async Thunks ---

export const registerUser = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await authApi.register(userData);
    return response.data;
  } catch (error) { return rejectWithValue(error.response?.data?.message || error.message); }
});

export const fetchUsers = createAsyncThunk("user/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await authApi.getUsers();
    return response.data.data; 
  } catch (error) { return rejectWithValue(error.response?.data?.message || error.message); }
});

export const fetchUserById = createAsyncThunk("user/fetchUserById", async (userId, { rejectWithValue }) => {
  try {
    const response = await authApi.getUserById(userId);
    return response.data.data;
  } catch (error) { return rejectWithValue(error.response?.data?.message || error.message); }
});

export const loginUser = createAsyncThunk('auth/loginUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await authApi.login(userData);
    return response.data;
  } catch (error) { return rejectWithValue(error.response?.data?.message || error.message); }
});

export const getUserProfile = createAsyncThunk('auth/getUserProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await authApi.getProfile();
    return response.data;
  } catch (error) { return rejectWithValue(error.response?.data?.message || error.message); }
});

export const updateUserProfile = createAsyncThunk('auth/updateUserProfile', async (formData, { rejectWithValue }) => {
  try {
    const response = await authApi.updateProfile(formData);
    return response.data;
  } catch (error) { return rejectWithValue(error.response?.data?.message || error.message); }
});

// --- Slice Configuration ---

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    users: [],
    user: user,
    token: token,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ''
  },
  reducers: {
    resetState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => { state.isLoading = true; state.isError = false; state.isSuccess = false; state.message = ''; })
      .addCase(registerUser.fulfilled, (state) => { state.isLoading = false; state.isSuccess = true; state.message = 'Registration successful, please log in.'; })
      .addCase(registerUser.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload || 'Registration failed'; })

      // Login
      .addCase(loginUser.pending, (state) => { state.isLoading = true; state.isError = false; state.isSuccess = false; state.message = ''; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })

      // Fetch Users
      .addCase(fetchUsers.pending, (state) => { state.loading = true; state.error = null; state.users = []; })
      .addCase(fetchUsers.fulfilled, (state, action) => { state.loading = false; state.users = action.payload; })
      .addCase(fetchUsers.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      // Get Profile
      .addCase(getUserProfile.pending, (state) => { state.isLoading = true; state.isError = false; state.isSuccess = false; })
      .addCase(getUserProfile.fulfilled, (state, action) => { state.isLoading = false; state.user = action.payload.user ?? action.payload; state.isSuccess = true; })
      .addCase(getUserProfile.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })
      
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => { state.isLoading = true; state.isError = false; state.isSuccess = false; })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true;
        state.user = action.payload.user ?? action.payload;
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(updateUserProfile.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; });
  }
});

export const { resetState, logout } = authSlice.actions;
export default authSlice.reducer;

// --- Selectors ---
export const selectAuthUser = (state) => state.auth.user;
export const selectUsers = (state) => state.auth.users;
export const selectAuthToken = (state) => state.auth.token;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.isError;
export const selectAuthSuccess = (state) => state.auth.isSuccess;
export const selectAuthMessage = (state) => state.auth.message;
export const selectUserById = (state, userId) => state.auth.users.find((user) => user._id === userId);