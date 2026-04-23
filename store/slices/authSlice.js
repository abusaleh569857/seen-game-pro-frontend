import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { clearAuth, getAccessToken, getRefreshToken, getUserFromCookie, saveAuth, saveUserToCookie } from '@/lib/auth';

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

export const updateProfileUser = createAsyncThunk(
  'auth/updateProfile',
  async ({ username, email, currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const payload = { username, email };
      if (currentPassword) payload.currentPassword = currentPassword;
      if (newPassword) payload.newPassword = newPassword;

      const { data } = await api.put('/auth/profile', payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Profile update failed');
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
      const accessToken = getAccessToken();
      if (user && accessToken) {
        state.user = user;
        state.isLoggedIn = true;
      } else {
        clearAuth();
        state.user = null;
        state.isLoggedIn = false;
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
    setUser(state, action) {
      state.user = action.payload;
      if (action.payload) {
        saveUserToCookie(action.payload);
      }
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
      })
      .addCase(updateProfileUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload?.user || state.user;
        if (action.payload?.user) {
          saveUserToCookie(action.payload.user);
        }
      })
      .addCase(updateProfileUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      });
  },
});

export const {
  initAuth,
  updateUserBalance,
  clearError,
  clearRegisterSuccess,
  setUser,
} = authSlice.actions;

export default authSlice.reducer;
