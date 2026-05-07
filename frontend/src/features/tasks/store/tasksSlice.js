import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { tasksApi } from '../api/tasksApi';

export const fetchTasksThunk = createAsyncThunk(
  'tasks/fetch',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      return await tasksApi.list(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createTaskThunk = createAsyncThunk(
  'tasks/create',
  async (payload, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      await tasksApi.create(token, payload);
      thunkAPI.dispatch(fetchTasksThunk());
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateTaskStatusThunk = createAsyncThunk(
  'tasks/updateStatus',
  async ({ id, status }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      await tasksApi.update(token, id, { status });
      thunkAPI.dispatch(fetchTasksThunk());
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: { items: [], loading: false, error: '' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksThunk.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchTasksThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasksThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTaskThunk.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateTaskStatusThunk.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export default tasksSlice.reducer;
