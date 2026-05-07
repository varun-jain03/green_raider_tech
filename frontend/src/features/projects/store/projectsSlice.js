import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { projectsApi } from "../api/projectsApi";

export const fetchProjectsThunk = createAsyncThunk("projects/fetch", async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    return await projectsApi.list(token);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const createProjectThunk = createAsyncThunk(
  "projects/create",
  async (payload, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      await projectsApi.create(token, payload);
      thunkAPI.dispatch(fetchProjectsThunk());
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const projectsSlice = createSlice({
  name: "projects",
  initialState: { items: [], loading: false, error: "" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectsThunk.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchProjectsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProjectsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProjectThunk.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default projectsSlice.reducer;
