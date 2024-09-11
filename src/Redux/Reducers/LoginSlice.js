import { createSlice } from "@reduxjs/toolkit";
import { login } from "../API/UserAPI";

const initialState = {
    user: {},
    status: false,
    error: ''
}

const LoginSlice = createSlice({
    name: 'login',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state, action) => {
            state.status = 'loading'
            console.log('Loading');
        })
        builder.addCase(login.fulfilled, (state, action) => {
            state.status = 'success'
            state.user = action.payload
            console.log('Success');
        })
        builder.addCase(login.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.payload
            console.log('Error');
        })
    }
})

export default LoginSlice.reducer