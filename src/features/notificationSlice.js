import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    notifications: [
        {
            id: '1',
            title: 'Warning Alert!',
            message: 'You tried scanning outside allowed radius.',
            type: 'warning',
        },
        {
            id: '2',
            title: 'Congratulations!',
            message: 'You’ve earned 100 bonus points.',
            type: 'congrats',
        },
        {
            id: '3',
            title: 'Warning!',
            message: 'Multiple failed scan attempts detected.',
            type: 'warning',
        },
        {
            id: '4',
            title: 'Reward Unlocked!',
            message: 'Cashback applied at XYZ Store.',
            type: 'congrats',
        },
    ]
}

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload); 
        },
        clearNotifications: (state) => {
            state.notifications = [];
        },
    },
});

export const { addNotification, clearNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;