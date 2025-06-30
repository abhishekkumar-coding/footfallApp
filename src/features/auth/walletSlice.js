import { createSlice } from '@reduxjs/toolkit';

const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    refreshTrigger: 0,
  },
  reducers: {
    triggerWalletRefresh: (state) => {
      state.refreshTrigger += 1;  // increment to notify listeners
    },
  },
});

export const { triggerWalletRefresh } = walletSlice.actions;
export default walletSlice.reducer;
