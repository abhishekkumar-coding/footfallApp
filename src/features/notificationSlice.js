import { createSlice } from '@reduxjs/toolkit';


const initialState = {
 notifications: [
    {
      id: '1',
      title: 'warning_alert_title', 
      message: 'outside_radius_message',
      type: 'warning',
    },
    {
      id: '2',
      title: 'congrats_title',
      message: 'earned_bonus_message',
      type: 'congrats',
    },
    {
      id: '3',
      title: 'warning_title',
      message: 'failed_scan_message',
      type: 'warning',
    },
    {
      id: '4',
      title: 'reward_title',
      message: 'cashback_applied_message',
      type: 'congrats',
    },
  ],
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