import { createAsyncThunk } from "@reduxjs/toolkit";
import Geolocation from 'react-native-geolocation-service';

export const getUserLocation = createAsyncThunk(
    'getUserLocation',
    async (data, { rejectWithValue }) => {
        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    return resolve([longitude, latitude]);
                },
                error => {
                    reject(rejectWithValue(error.message));
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        });
    }
)