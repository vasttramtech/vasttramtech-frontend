// src/state/jobberMastersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchJobberMasters = createAsyncThunk(
  'jobberMasters/fetchJobberMasters',
  async (token, thunkAPI) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/jobber-masters`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const jobberMastersSlice = createSlice({
  name: 'jobberMasters',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobberMasters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobberMasters.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchJobberMasters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch jobber masters';
      });
  },
});

export default jobberMastersSlice.reducer;
