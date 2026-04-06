import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '@/lib/api';

export const createCharge = createAsyncThunk(
  'shop/createCharge',
  async (packageKey, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/payment/create', { packageKey });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Payment failed to initialize');
    }
  }
);

const PACKAGES = {
  small: {
    qeem: 5,
    price: 1.5,
    label: 'Small',
    color: 'from-blue-900 to-blue-800 border-blue-600',
  },
  medium: {
    qeem: 10,
    price: 2.5,
    label: 'Medium',
    color: 'from-purple-900 to-purple-800 border-purple-600',
  },
  large: {
    qeem: 25,
    price: 5.0,
    label: 'Large',
    color: 'from-amber-900 to-amber-800 border-amber-600',
  },
  giant: {
    qeem: 50,
    price: 9.0,
    label: 'Giant',
    color: 'from-red-900 to-red-800 border-red-600',
  },
};

const shopSlice = createSlice({
  name: 'shop',
  initialState: {
    packages: PACKAGES,
    loadingPackage: null,
    checkoutUrl: null,
    error: null,
  },
  reducers: {
    clearShopError(state) {
      state.error = null;
    },
    clearCheckoutUrl(state) {
      state.checkoutUrl = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCharge.pending, (state, action) => {
        state.loadingPackage = action.meta.arg;
        state.error = null;
        state.checkoutUrl = null;
      })
      .addCase(createCharge.fulfilled, (state, action) => {
        state.loadingPackage = null;
        state.checkoutUrl = action.payload.checkoutUrl || null;
      })
      .addCase(createCharge.rejected, (state, action) => {
        state.loadingPackage = null;
        state.error = action.payload;
      });
  },
});

export const { clearShopError, clearCheckoutUrl } = shopSlice.actions;
export default shopSlice.reducer;