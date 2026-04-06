import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '@/lib/api';

export const fetchAdminStats = createAsyncThunk(
  'admin/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/stats');
      return data.stats;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load stats');
    }
  }
);

export const fetchAdminUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (search = '', { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/admin/users?search=${encodeURIComponent(search)}`);
      return data.users;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load users');
    }
  }
);

export const toggleBanUser = createAsyncThunk(
  'admin/toggleBan',
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/admin/users/${userId}/ban`);
      return { userId, isBanned: data.isBanned };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

export const fetchAdminQuestions = createAsyncThunk(
  'admin/fetchQuestions',
  async ({ page = 1, categoryId = '', language = '' } = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/questions?page=${page}&categoryId=${categoryId}&language=${language}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load questions');
    }
  }
);

export const deleteQuestion = createAsyncThunk(
  'admin/deleteQuestion',
  async (questionId, { rejectWithValue }) => {
    try {
      await api.delete(`/questions/${questionId}`);
      return questionId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete');
    }
  }
);

export const generateQuestions = createAsyncThunk(
  'admin/generateQuestions',
  async ({ categoryId, language, count }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/questions/generate', {
        categoryId,
        language,
        count,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Generation failed');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    stats: null,
    statsLoading: false,
    users: [],
    usersLoading: false,
    questions: [],
    questionsTotal: 0,
    questionsLoading: false,
    generateLoading: false,
    generateResult: null,
    error: null,
  },
  reducers: {
    clearAdminError(state) {
      state.error = null;
    },
    clearGenerateResult(state) {
      state.generateResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.pending, (state) => {
        state.statsLoading = true;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdminUsers.pending, (state) => {
        state.usersLoading = true;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.error = action.payload;
      })
      .addCase(toggleBanUser.fulfilled, (state, action) => {
        const { userId, isBanned } = action.payload;
        const user = state.users.find((item) => item.id === userId);

        if (user) {
          user.is_banned = isBanned;
        }
      })
      .addCase(fetchAdminQuestions.pending, (state) => {
        state.questionsLoading = true;
      })
      .addCase(fetchAdminQuestions.fulfilled, (state, action) => {
        state.questionsLoading = false;
        state.questions = action.payload.questions;
        state.questionsTotal = action.payload.total;
      })
      .addCase(fetchAdminQuestions.rejected, (state, action) => {
        state.questionsLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.questions = state.questions.filter((question) => question.id !== action.payload);
      })
      .addCase(generateQuestions.pending, (state) => {
        state.generateLoading = true;
        state.generateResult = null;
        state.error = null;
      })
      .addCase(generateQuestions.fulfilled, (state, action) => {
        state.generateLoading = false;
        state.generateResult = { success: true, message: action.payload.message };
      })
      .addCase(generateQuestions.rejected, (state, action) => {
        state.generateLoading = false;
        state.generateResult = { success: false, message: action.payload };
      });
  },
});

export const { clearAdminError, clearGenerateResult } = adminSlice.actions;
export default adminSlice.reducer;