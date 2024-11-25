import { createSlice } from "@reduxjs/toolkit";
import { getUserLocation } from "../API/UserLocation";

const initialState = {
    userLocation: null,
    status: false,
    error: null
}

const UserLocationSlice = createSlice({
    name: 'userLocation',
    initialState,
    reducers: {
        setUserLocation: (state, action) => {
            state.userLocation = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserLocation.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(getUserLocation.fulfilled, (state, action) => {
                state.status = 'success'
                state.userLocation = action.payload
            })
            .addCase(getUserLocation.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
    }
})

export default UserLocationSlice.reducer