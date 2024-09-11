import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../helpers/AxiosInstance";

export const login = createAsyncThunk(
    'login',
    async (data, { rejectedWithValue }) => {
        try {
            const response = await AxiosInstance().post('/users/login', data)
            return response.data
        } catch (error) {
            return rejectedWithValue(error)
        }
    }
)