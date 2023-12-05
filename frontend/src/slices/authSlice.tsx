import { createSlice } from '@reduxjs/toolkit';

const userInfo: string | null = localStorage.getItem('userInfo');
const initialState = {
    userInfo: userInfo ? JSON.parse(userInfo) : null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
        },
        logout: (state, action) => {
            state.userInfo = null;
            localStorage.removeItem('userInfo');
        }
    }
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;