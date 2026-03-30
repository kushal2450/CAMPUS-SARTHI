import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import jobsApi from "../api/jobsApi";

// --- Async Thunks ---
export const createJob = createAsyncThunk('jobs/createJob', async (data, { rejectWithValue }) => {
  try { const response = await jobsApi.create(data); return response.data.data; } 
  catch (error) { return rejectWithValue(error.response?.data?.message || error.message); }
});

export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async (_, { rejectWithValue }) => {
  try { const response = await jobsApi.getAll(); return response.data.data; } 
  catch (error) { return rejectWithValue(error.response?.data?.message || error.message); }
});

export const fetchJobById = createAsyncThunk('jobs/fetchJobById', async (id, { rejectWithValue }) => {
  try { const response = await jobsApi.getById(id); return response.data.data; } 
  catch (error) { return rejectWithValue(error.response?.data?.message || error.message); }
});

export const updateJob = createAsyncThunk('jobs/updateJob', async ({ id, data }, { rejectWithValue }) => {
  try { const response = await jobsApi.update(id, data); return response.data.data; } 
  catch (error) { return rejectWithValue(error.response?.data?.message || error.message); }
});

export const deleteJob = createAsyncThunk('jobs/deleteJob', async (id, { rejectWithValue }) => {
  try { await jobsApi.delete(id); return id; } 
  catch (error) { return rejectWithValue(error.response?.data?.message || error.message); }
});

// --- Slice Configuration ---
const jobSlice = createSlice({
  name: 'jobs',
  initialState: { jobs: [], selectedJob: null, loading: false, error: null, success: false, message: '' },
  reducers: {
    clearSelectedJob: (state) => { state.selectedJob = null; state.error = null; state.success = false; state.message = ''; state.loading = false; },
    clearJobError: (state) => { state.error = null; state.message = ''; state.success = false; state.loading = false; },
    resetJobState: (state) => { state.loading = false; state.error = null; state.success = false; state.message = ''; },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createJob.pending, (state) => { state.loading = true; state.error = null; state.success = false; })
      .addCase(createJob.fulfilled, (state, action) => { state.loading = false; state.success = true; state.jobs.push(action.payload); state.message = 'Job created successfully'; })
      .addCase(createJob.rejected, (state, action) => { state.loading = false; state.error = action.payload; state.success = false; })
      // Fetch All
      .addCase(fetchJobs.pending, (state) => { state.loading = true; state.error = null; state.success = false; })
      .addCase(fetchJobs.fulfilled, (state, action) => { state.loading = false; state.success = true; state.jobs = action.payload; })
      .addCase(fetchJobs.rejected, (state, action) => { state.loading = false; state.error = action.payload; state.success = false; })
      // Fetch By ID
      .addCase(fetchJobById.pending, (state) => { state.loading = true; state.error = null; state.success = false; })
      .addCase(fetchJobById.fulfilled, (state, action) => { state.loading = false; state.success = true; state.selectedJob = action.payload; })
      .addCase(fetchJobById.rejected, (state, action) => { state.loading = false; state.error = action.payload; state.success = false; })
      // Update
      .addCase(updateJob.pending, (state) => { state.loading = true; state.error = null; state.success = false; })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false; state.success = true;
        const index = state.jobs.findIndex((job) => job._id === action.payload._id);
        if (index !== -1) state.jobs[index] = action.payload;
        if (state.selectedJob && state.selectedJob._id === action.payload._id) state.selectedJob = action.payload;
      })
      .addCase(updateJob.rejected, (state, action) => { state.loading = false; state.error = action.payload; state.success = false; })
      // Delete
      .addCase(deleteJob.pending, (state) => { state.loading = true; state.error = null; state.success = false; })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false; state.success = true;
        state.jobs = state.jobs.filter((job) => job._id !== action.payload);
        if (state.selectedJob && state.selectedJob._id === action.payload) state.selectedJob = null;
      })
      .addCase(deleteJob.rejected, (state, action) => { state.loading = false; state.error = action.payload; state.success = false; });
  },
});

export const { clearSelectedJob, clearJobError, resetJobState } = jobSlice.actions;
export default jobSlice.reducer;

// --- Selectors ---
export const selectJobsState = (state) => state.jobs;
export const selectJobs = (state) => state.jobs.jobs;
export const selectSelectedJob = (state) => state.jobs.selectedJob;
export const selectJobsLoading = (state) => state.jobs.loading;
export const selectJobsError = (state) => state.jobs.error;
export const selectJobsSuccess = (state) => state.jobs.success;
export const selectJobsMessage = (state) => state.jobs.message;
export const selectJobById = (state, id) => state.jobs.jobs.find((job) => job._id === id);