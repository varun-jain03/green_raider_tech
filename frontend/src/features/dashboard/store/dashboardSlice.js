import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { dashboardApi } from '../api/dashboardApi';

export const fetchDashboardThunk = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await dashboardApi.getStats(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: { stats: null, loading: false, error: '' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardThunk.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchDashboardThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default dashboardSlice.reducer;
