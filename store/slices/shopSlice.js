import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '@/lib/api';

const PACKAGE_META = {
  small: {
    label: 'Small',
    accent: 'amber',
    borderClass: 'border-amber-200',
    buttonClass: 'from-[#f59e0b] to-[#f97316]',
    badgeClass: 'bg-amber-50 text-amber-600',
  },
  medium: {
    label: 'Medium',
    accent: 'violet',
    borderClass: 'border-violet-400',
    buttonClass: 'from-[#6d4eff] to-[#4f6fff]',
    badgeClass: 'bg-violet-50 text-violet-600',
    highlight: 'Most Popular',
  },
  large: {
    label: 'Large',
    accent: 'emerald',
    borderClass: 'border-emerald-200',
    buttonClass: 'from-[#22c55e] to-[#16a34a]',
    badgeClass: 'bg-emerald-50 text-emerald-600',
  },
  giant: {
    label: 'Giant',
    accent: 'rose',
    borderClass: 'border-rose-200',
    buttonClass: 'from-[#ef4444] to-[#f43f5e]',
    badgeClass: 'bg-rose-50 text-rose-600',
    helperText: 'Best value',
  },
};

export const fetchPackages = createAsyncThunk(
  'shop/fetchPackages',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/payment/packages');
      return data.packages || {};
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load packages');
    }
  },
);

export const createCharge = createAsyncThunk(
  'shop/createCharge',
  async (packageKey, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/payment/create', { packageKey });
      return { ...data, packageKey };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Payment failed to initialize');
    }
  },
);

export const buyJokerStock = createAsyncThunk(
  'shop/buyJokerStock',
  async (jokerType, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/joker/buy', { jokerType });
      return { ...data, jokerType };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to buy joker');
    }
  },
);

function normalizePackages(packages) {
  return Object.entries(packages || {}).reduce((result, [key, pkg]) => {
    const meta = PACKAGE_META[key] || {};
    const qeem = Number(pkg.qeem || 0);
    const price = Number(pkg.price || 0);

    result[key] = {
      ...meta,
      key,
      label: pkg.label || meta.label || key,
      qeem,
      price,
      rate: qeem > 0 ? (price / qeem).toFixed(2) : '0.00',
    };

    return result;
  }, {});
}

const shopSlice = createSlice({
  name: 'shop',
  initialState: {
    packages: {},
    packagesLoading: false,
    loadingPackage: null,
    loadingJoker: null,
    checkoutUrl: null,
    error: null,
    jokerPurchaseResult: null,
  },
  reducers: {
    clearShopError(state) {
      state.error = null;
    },
    clearCheckoutUrl(state) {
      state.checkoutUrl = null;
    },
    clearJokerPurchaseResult(state) {
      state.jokerPurchaseResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPackages.pending, (state) => {
        state.packagesLoading = true;
        state.error = null;
      })
      .addCase(fetchPackages.fulfilled, (state, action) => {
        state.packagesLoading = false;
        state.packages = normalizePackages(action.payload);
      })
      .addCase(fetchPackages.rejected, (state, action) => {
        state.packagesLoading = false;
        state.error = action.payload;
      })
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
      })
      .addCase(buyJokerStock.pending, (state, action) => {
        state.loadingJoker = action.meta.arg;
        state.error = null;
        state.jokerPurchaseResult = null;
      })
      .addCase(buyJokerStock.fulfilled, (state, action) => {
        state.loadingJoker = null;
        state.jokerPurchaseResult = action.payload;

        if (!action.payload.success) {
          state.error = action.payload.message || 'Could not buy joker';
        }
      })
      .addCase(buyJokerStock.rejected, (state, action) => {
        state.loadingJoker = null;
        state.error = action.payload;
      });
  },
});

export const {
  clearShopError,
  clearCheckoutUrl,
  clearJokerPurchaseResult,
} = shopSlice.actions;

export default shopSlice.reducer;
