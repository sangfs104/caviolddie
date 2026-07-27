// redux/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: { id: string; name: string; email: string } | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ id: string; name: string; email: string } | null>) {
      state.user = action.payload;
    },
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;