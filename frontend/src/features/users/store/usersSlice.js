import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { usersApi } from "../api/usersApi";

export const fetchUsersThunk = createAsyncThunk("users/fetch", async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    return await usersApi.list(token);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const usersSlice = createSlice({
  name: "users",
  initialState: { items: [], loading: false, error: "" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default usersSlice.reducer;
