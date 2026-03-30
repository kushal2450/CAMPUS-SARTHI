import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import companyApi from '../api/companyApi';

// --- Async Thunks ---

export const fetchCompanies = createAsyncThunk('company/fetchCompanies', async (_, { rejectWithValue }) => {
    try {
        const response = await companyApi.getAll();
        return response.data.data;
    } catch (error) { return rejectWithValue(error.response?.data?.message || error.message); }
});

export const createCompany = createAsyncThunk('company/createCompany', async (data, { rejectWithValue }) => {
    try {
        const response = await companyApi.create(data);
        return response.data.data;
    } catch (error) { return rejectWithValue(error.response?.data?.message || error.message); }
});

export const updateCompany = createAsyncThunk('company/updateCompany', async ({ id, data }, { rejectWithValue }) => {
    try {
        const response = await companyApi.updateCompany(id, data);
        return response.data.data
    } catch (error) { return rejectWithValue(error.response?.data?.message || error.message); }
});

export const deleteCompany = createAsyncThunk('company/deleteCompany', async (id, { rejectWithValue }) => {
    try {
        await companyApi.deleteCompany(id);
        return id;
    } catch (error) { return rejectWithValue(error.response?.data?.message || error.message); }
});

export const fetchCompanyDashboard = createAsyncThunk('company/fetchCompanyDashboard', async (_, { rejectWithValue }) => {
    try {
        const response = await companyApi.getDashboard();
        return response.data.data;
    } catch (error) { return rejectWithValue(error.response?.data?.message || error.message); }
});

// --- Slice Configuration ---

const initialState = {
    companies: [],
    selectedCompany: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
    dashboard: {
        jobsPosted: 0,
        applicationsReceived: 0,
        upcomingInterviews: 0,
        isLoading: false,
        isError: false,
        errorMessage: '',
    },
};

const companySlice = createSlice({
    name: 'company',
    initialState,
    reducers: {
        resetCompanyState: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
            state.selectedCompany = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchCompanies.pending, (state) => { state.isLoading = true; state.isError = false; state.isSuccess = false; state.message = ''; })
            .addCase(fetchCompanies.fulfilled, (state, action) => { state.isLoading = false; state.isSuccess = true; state.companies = action.payload; })
            .addCase(fetchCompanies.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })

            // Create
            .addCase(createCompany.pending, (state) => { state.isLoading = true; state.isError = false; state.isSuccess = false; })
            .addCase(createCompany.fulfilled, (state, action) => { state.isLoading = false; state.isSuccess = true; state.companies.push(action.payload); })
            .addCase(createCompany.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })

            // Update
            .addCase(updateCompany.pending, (state) => { state.isLoading = true; state.isError = false; state.isSuccess = false; })
            .addCase(updateCompany.fulfilled, (state, action) => {
                state.isLoading = false; state.isSuccess = true;
                state.companies = state.companies.map((company) => company._id === action.payload._id ? action.payload : company);
            })
            .addCase(updateCompany.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })

            // Delete
            .addCase(deleteCompany.pending, (state) => { state.isLoading = true; state.isError = false; state.isSuccess = false; })
            .addCase(deleteCompany.fulfilled, (state, action) => {
                state.isLoading = false; state.isSuccess = true;
                state.companies = state.companies.filter((company) => company._id !== action.payload);
            })
            .addCase(deleteCompany.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })

            // Dashboard 
            .addCase(fetchCompanyDashboard.pending, (state) => { state.dashboard.isLoading = true; state.dashboard.isError = false; })
            .addCase(fetchCompanyDashboard.fulfilled, (state, action) => {
                state.dashboard.isLoading = false;
                state.dashboard.jobsPosted = action.payload.jobsPosted;
                state.dashboard.applicationsReceived = action.payload.applicationsReceived;
                state.dashboard.upcomingInterviews = action.payload.upcomingInterviews;
            })
            .addCase(fetchCompanyDashboard.rejected, (state, action) => {
                state.dashboard.isLoading = false;
                state.dashboard.isError = true;
                state.dashboard.errorMessage = action.payload;
            });
    }
});

export const { resetCompanyState } = companySlice.actions;
export default companySlice.reducer;

// --- Selectors ---
export const selectAllCompanies = (state) => state.company.companies;
export const selectCompanyById = (state) => state.company.selectedCompany;
export const selectCompanyLoading = (state) => state.company.isLoading;
export const selectCompanyError = (state) => state.company.isError;
export const selectCompanySuccess = (state) => state.company.isSuccess;
export const selectDashboardJobsPosted = (state) => state.company.dashboard.jobsPosted;
export const selectDashboardApplicationsReceived = (state) => state.company.dashboard.applicationsReceived;
export const selectDashboardUpcomingInterviews = (state) => state.company.dashboard.upcomingInterviews;
export const selectDashboardLoading = (state) => state.company.dashboard.isLoading;
export const selectDashboardError = (state) => state.company.dashboard.isError;
export const selectDashboardErrorMessage = (state) => state.company.dashboard.errorMessage;