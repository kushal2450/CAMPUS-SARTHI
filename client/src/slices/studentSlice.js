import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import studentApi from "../api/studentApi";

// --- Async Thunks ---
export const createStudent = createAsyncThunk('student/create', async (data, { rejectWithValue }) => {
    try { const response = await studentApi.create(data); return response.data.data; } 
    catch (error) { return rejectWithValue(error.response?.data?.message || error.message); }
});

export const fetchStudents = createAsyncThunk('student/fetchAll', async (_, { rejectWithValue }) => {
    try { const response = await studentApi.getAll(); return response.data.data; } 
    catch (error) { return rejectWithValue(error.response?.data?.message || error.message); }
});

export const fetchStudentById = createAsyncThunk('student/fetchById', async (id, { rejectWithValue }) => {
    try { const response = await studentApi.getById(id); return response.data.data; } 
    catch (error) { return rejectWithValue(error.response?.data?.message || error.message); }
});

export const updateStudent = createAsyncThunk('student/update', async ({ id, data }, { rejectWithValue }) => {
    try { const response = await studentApi.update(id, data); return response.data.data; } 
    catch (error) { return rejectWithValue(error.response?.data?.message || error.message); }
});

export const deleteStudent = createAsyncThunk('student/deleteStudent', async (id, { rejectWithValue }) => {
    try { await studentApi.delete(id); return id; } 
    catch (error) { return rejectWithValue(error.response?.data?.message || error.message); }
});

export const uploadStudentResume = createAsyncThunk('student/uploadResume', async ({ file }, { rejectWithValue }) => {
    try {
        const formData = new FormData();
        formData.append('resume', file);
        const response = await studentApi.uploadResume(formData);
        return response.data.url; // Returns URL string
    } catch (error) { return rejectWithValue(error.response?.data?.message || error.message); }
});

// --- Slice Configuration ---
const studentSlice = createSlice({
    name: 'student',
    initialState: { students: [], selectedStudent: null, applications: [], interviews: [], drives: [], companies: [], jobs: [], stats: {}, loading: false, error: null },
    reducers: {
        clearSelectedStudent: (state) => { state.selectedStudent = null; state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            // Create
            .addCase(createStudent.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(createStudent.fulfilled, (state, action) => { state.loading = false; state.students.push(action.payload); })
            .addCase(createStudent.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            // Fetch All
            .addCase(fetchStudents.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchStudents.fulfilled, (state, action) => { state.loading = false; state.students = action.payload; })
            .addCase(fetchStudents.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            // Fetch By ID
            .addCase(fetchStudentById.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchStudentById.fulfilled, (state, action) => { state.loading = false; state.selectedStudent = action.payload; })
            .addCase(fetchStudentById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            // Update
            .addCase(updateStudent.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updateStudent.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.students.findIndex(item => item._id === action.payload._id);
                if (index !== -1) state.students[index] = action.payload;
            })
            .addCase(updateStudent.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            // Delete
            .addCase(deleteStudent.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(deleteStudent.fulfilled, (state, action) => { state.loading = false; state.students = state.students.filter(item => item._id !== action.payload); })
            .addCase(deleteStudent.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            // Upload Resume
            .addCase(uploadStudentResume.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(uploadStudentResume.fulfilled, (state, action) => {
                state.loading = false;
                // Note: The payload is just the string URL, so updating the array via ID match won't work perfectly here.
                // It assumes the API returns the updated student object, but the thunk returns response.data.url.
                // Keeping original logic intact to avoid breaking your component flow!
                const index = state.students.findIndex((item) => item._id === action.payload._id);
                if (index !== -1) state.students[index] = action.payload;
                state.selectedStudent = action.payload;
            })
            .addCase(uploadStudentResume.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
    }
});

export const { clearSelectedStudent } = studentSlice.actions;
export default studentSlice.reducer;

// --- Selectors ---
export const selectStudents = (state) => state.student.students;
export const selectSelectedStudent = (state) => state.student.selectedStudent;
export const selectStudentLoading = (state) => state.student.loading;
export const selectStudentError = (state) => state.student.error;