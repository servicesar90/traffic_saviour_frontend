import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiFunction } from "../api/ApiFunction";
import { getProfileApi } from "../api/Apis";

export const fetchProfile = createAsyncThunk(
  "getData/fetchProfile",
  async () => {
    try {
      const response = await apiFunction("get", getProfileApi, null, null);
      if (response) {
        console.log(response.data.data)
        return response.data.data;
      }
    } catch (e) {
      console.log("err", e);
    }
  }
);

const initialState = {
  profile: null,
  loading: null,
  error: null,
};

const CloakSlice = createSlice({
  name: "getData",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.profile = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = false;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });
  },
});

export default CloakSlice.reducer;