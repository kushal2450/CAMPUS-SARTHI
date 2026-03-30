import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import applicationApi from "../api/applicationsApi";

// --- Async Thunks ---

export const fetchApplications = createAsyncThunk('applications/fetchApplications', async (_, { rejectWithValue }) => {
    try {
        const response = await applicationApi.getApplications();
        return response.data.data || response.data;
    } catch (error) { return rejectWithValue(error.response?.data?.message || error.message); }
});

export const fetchMyApplications = createAsyncThunk('applications/fetchMyApplications', async (_, { rejectWithValue }) => {
    try {
        const response = await applicationApi.getMyApplications();
        return response.data.data || response.data;
    } catch (error) { return rejectWithValue(error.response?.data?.message || error.message); }
});

export const fetchCompanyApplications = createAsyncThunk('applications/fetchCompanyApplications', async (_, { rejectWithValue }) => {
    try {
        const response = await applicationApi.getCompanyApplications();
        return response.data.data || response.data;
    } catch (error) { return rejectWithValue(error.response?.data?.message || error.message); }
});

export const createApplication = createAsyncThunk('applications/createApplication', async (data, { rejectWithValue }) => {
    try {
        const response = await applicationApi.createApplication(data);
        return response.data.data || response.data;
    } catch (error) { return rejectWithValue(error.response?.data?.message || error.message); }
});

export const updateApplication = createAsyncThunk('applications/updateApplication', async ({ id, data }, { rejectWithValue }) => {
    try {
        const response = await applicationApi.updateApplication(id, data);
        return response.data.data;
    } catch (error) { return rejectWithValue(error.response?.data?.message || error.message); }
});

export const deleteApplication = createAsyncThunk('applications/deleteApplication', async (id, { rejectWithValue }) => {
    try {
        await applicationApi.deleteApplication(id);
        return id;
    } catch (error) { return rejectWithValue(error.response?.data?.message || error.message); }
});

export const getApplicationById = createAsyncThunk('applications/getApplicationById', async (id, { rejectWithValue }) => {
    try {
        const response = await applicationApi.getById(id);
        return response.data.data;
    } catch (error) { return rejectWithValue(error.response?.data?.message || error.message); }
});

export const fetchApplicationStatusCounts = createAsyncThunk("applications/fetchApplicationStatusCounts", async (_, { rejectWithValue }) => {
    try {
        const response = await applicationApi.getApplicationStatusCounts();
        return response.data.data || response.data;
    } catch (error) { return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch status counts"); }
});

// --- Slice Configuration ---

const applicationSlice = createSlice({
    name: 'applications',
    initialState: {
        items: [],
        loading: false,
        error: null,
        success: false,
        message: null,
        statusCounts: [],
        statusCountsLoading: false,
        statusCountsError: null,
    },
    reducers: {
        resetStatus: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
            state.message = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch All
            .addCase(fetchApplications.pending, (state) => { state.loading = true; state.error = null; state.success = false; })
            .addCase(fetchApplications.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; state.success = true; })
            .addCase(fetchApplications.rejected, (state, action) => { state.loading = false; state.error = action.payload; state.success = false; })
            
            // Fetch Mine (Student)
            .addCase(fetchMyApplications.pending, (state) => { state.loading = true; state.error = null; state.success = false; })
            .addCase(fetchMyApplications.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; state.success = true; })
            .addCase(fetchMyApplications.rejected, (state, action) => { state.loading = false; state.error = action.payload; state.success = false; })
            
            // Fetch Company Apps
            .addCase(fetchCompanyApplications.pending, (state) => { state.loading = true; state.error = null; state.success = false; })
            .addCase(fetchCompanyApplications.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; state.success = true; })
            .addCase(fetchCompanyApplications.rejected, (state, action) => { state.loading = false; state.error = action.payload; state.success = false; })
            
            // Create
            .addCase(createApplication.pending, (state) => { state.loading = true; state.error = null; state.success = false; })
            .addCase(createApplication.fulfilled, (state, action) => { state.loading = false; state.items.push(action.payload); state.success = true; })
            .addCase(createApplication.rejected, (state, action) => { state.loading = false; state.error = action.payload; state.success = false; })
            
            // Get By ID
            .addCase(getApplicationById.pending, (state) => { state.loading = true; state.error = null; state.success = false; })
            .addCase(getApplicationById.fulfilled, (state, action) => {
                state.loading = false; state.success = true;
                const index = state.items.findIndex(app => app._id === action.payload._id);
                if (index !== -1) state.items[index] = action.payload; else state.items.push(action.payload);
            })
            .addCase(getApplicationById.rejected, (state, action) => { state.loading = false; state.error = action.payload; state.success = false; })
            
            // Update
            .addCase(updateApplication.pending, (state) => { state.loading = true; state.error = null; state.success = false; })
            .addCase(updateApplication.fulfilled, (state, action) => {
                state.loading = false; state.success = true;
                const index = state.items.findIndex((app) => app._id === action.payload._id);
                if (index !== -1) state.items[index] = action.payload;
            })
            .addCase(updateApplication.rejected, (state, action) => { state.loading = false; state.error = action.payload; state.success = false; })
            
            // Delete
            .addCase(deleteApplication.pending, (state) => { state.loading = true; state.error = null; state.success = false; })
            .addCase(deleteApplication.fulfilled, (state, action) => {
                state.loading = false; state.success = true;
                state.items = state.items.filter((app) => app._id !== action.payload);
            })
            .addCase(deleteApplication.rejected, (state, action) => { state.loading = false; state.error = action.payload; state.success = false; })
            
            // Status Counts
            .addCase(fetchApplicationStatusCounts.pending, (state) => { state.statusCountsLoading = true; state.statusCountsError = null; })
            .addCase(fetchApplicationStatusCounts.fulfilled, (state, action) => { state.statusCountsLoading = false; state.statusCounts = action.payload; })
            .addCase(fetchApplicationStatusCounts.rejected, (state, action) => { state.statusCountsLoading = false; state.statusCountsError = action.payload; });
    }
});

export const { resetStatus } = applicationSlice.actions;
export default applicationSlice.reducer;

// --- Selectors ---
export const selectAllApplications = (state) => state.applications.items;
export const selectApplicationLoading = (state) => state.applications.loading;
export const selectApplicationError = (state) => state.applications.error;
export const selectApplicationById = (state, applicationId) => state.applications.items.find((app) => app._id === applicationId);
export const selectApplicationsByStudent = createSelector(
    [selectAllApplications, (state, studentId) => studentId],
    (applications, studentId) => applications.filter(app => app.candidate === studentId || app.candidate?._id === studentId)
);
export const selectApplicationsByJob = (state, jobId) => state.applications.items.filter((app) => app.job._id === jobId);
export const selectApplicationsByCompany = (state, companyId) => state.applications.items.filter((app) => app.job.company._id === companyId);
export const selectApplicationStatusCounts = (state) => state.applications.statusCounts;