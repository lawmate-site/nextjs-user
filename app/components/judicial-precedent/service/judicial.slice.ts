import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "../init/judicialState.init";

export const judicialSlice = createSlice({
  name: "judicial",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export const {} = judicialSlice.actions;

export const getCaseLawList = (state: any) => state.user.array;

export default judicialSlice.reducer;
