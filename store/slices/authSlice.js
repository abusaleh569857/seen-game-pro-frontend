import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { clearAuth, getRefreshToken, getUserFromCookie, saveAuth } from '@/lib/auth';

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      saveAuth(data.accessToken, data.refreshToken, data.user);
      return data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/register', { username, email, password });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = getRefreshToken();
      await api.post('/auth/logout', { refreshToken });
      clearAuth();
      return true;
    } catch (error) {
      clearAuth();
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const socialAuthUser = createAsyncThunk(
  'auth/socialAuth',
  async ({ provider, token }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/social', { provider, token });
      saveAuth(data.accessToken, data.refreshToken, data.user);
      return data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Social login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isLoggedIn: false,
    initialized: false,
    loading: false,
    error: null,
    registerSuccess: false,
  },
  reducers: {
    initAuth(state) {
      const user = getUserFromCookie();
      if (user) {
        state.user = user;
        state.isLoggedIn = true;
      }
      state.initialized = true;
    },
    updateUserBalance(state, action) {
      if (state.user) {
        state.user.qeemBalance = action.payload;
        state.user.qeem_balance = action.payload;
      }
    },
    clearError(state) {
      state.error = null;
    },
    clearRegisterSuccess(state) {
      state.registerSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isLoggedIn = true;
        state.initialized = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.initialized = true;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registerSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.registerSuccess = !!action.payload?.success;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(socialAuthUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(socialAuthUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isLoggedIn = true;
        state.initialized = true;
        state.error = null;
      })
      .addCase(socialAuthUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.initialized = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isLoggedIn = false;
        state.loading = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.isLoggedIn = false;
        state.loading = false;
      });
  },
});

export const {
  initAuth,
  updateUserBalance,
  clearError,
  clearRegisterSuccess,
} = authSlice.actions;

export default authSlice.reducer;
