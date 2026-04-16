import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '@/lib/api';

export const fetchCategories = createAsyncThunk(
  'quiz/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/questions/categories');
      return data.categories || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load categories');
    }
  }
);

export const startQuiz = createAsyncThunk(
  'quiz/start',
  async ({ categoryId, lang }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/quiz/start?categoryId=${categoryId}&lang=${lang}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to start quiz');
    }
  }
);

export const submitQuiz = createAsyncThunk(
  'quiz/submit',
  async ({ sessionId, answers }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/quiz/submit', { sessionId, answers });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit quiz');
    }
  }
);

export const fetchHistory = createAsyncThunk(
  'quiz/fetchHistory',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/quiz/history');
      return data.history;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load history');
    }
  }
);

export const fetchUserStats = createAsyncThunk(
  'quiz/fetchUserStats',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/quiz/stats');
      return data.stats;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load user stats');
    }
  }
);

export const fetchLeaderboard = createAsyncThunk(
  'quiz/fetchLeaderboard',
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();
      if (params?.period) {
        query.set('period', params.period);
      }
      if (params?.lang) {
        query.set('lang', params.lang);
      }

      const url = query.toString() ? `/leaderboard?${query.toString()}` : '/leaderboard';
      const { data } = await api.get(url);

      return {
        leaderboard: data.leaderboard || [],
        summary: data.summary || null,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load leaderboard');
    }
  }
);

export const fetchJokerInventory = createAsyncThunk(
  'quiz/fetchJokerInventory',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/joker/inventory');
      return data.inventory;
    } catch {
      return rejectWithValue(null);
    }
  }
);

export const useJoker = createAsyncThunk(
  'quiz/useJoker',
  async (jokerType, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/joker/use', { jokerType });
      return { data, jokerType };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to use joker');
    }
  }
);

const initialInventory = { fifty_fifty: 0, skip: 0, time: 0, reveal: 0 };

const quizSlice = createSlice({
  name: 'quiz',
  initialState: {
    categories: [],
    categoriesLoading: false,
    categoriesError: null,
    sessionId: null,
    questions: [],
    currentIndex: 0,
    answers: [],
    selectedOption: null,
    eliminatedOptions: [],
    quizStatus: 'idle',
    result: null,
    history: [],
    userStats: null,
    userStatsLoading: false,
    leaderboard: [],
    leaderboardSummary: null,
    leaderboardLoading: false,
    inventory: initialInventory,
    selectedLang: 'en',
    stats: {
      globalRank: '-',
      totalPoints: 0,
      totalGames: 0,
      bestStreak: 0,
      avgAccuracy: 0,
    },
    error: null,
  },
  reducers: {
    setSelectedLang(state, action) {
      state.selectedLang = action.payload;
    },
    selectAnswer(state, action) {
      if (state.quizStatus !== 'playing') {
        return;
      }

      const option = action.payload;
      const currentQuestion = state.questions[state.currentIndex];

      state.selectedOption = option;
      state.quizStatus = 'answered';

      if (currentQuestion) {
        state.answers.push({
          questionId: currentQuestion.id,
          selected: option,
        });
      }
    },
    nextQuestion(state) {
      state.currentIndex += 1;
      state.selectedOption = null;
      state.eliminatedOptions = [];
      state.quizStatus = 'playing';
    },
    eliminateOptions(state, action) {
      state.eliminatedOptions = action.payload;
    },
    resetQuiz(state) {
      state.sessionId = null;
      state.questions = [];
      state.currentIndex = 0;
      state.answers = [];
      state.selectedOption = null;
      state.eliminatedOptions = [];
      state.quizStatus = 'idle';
      state.result = null;
      state.error = null;
    },
    clearQuizError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesError = action.payload;
      })
      .addCase(startQuiz.pending, (state) => {
        state.quizStatus = 'loading';
        state.error = null;
        state.answers = [];
        state.currentIndex = 0;
        state.selectedOption = null;
        state.eliminatedOptions = [];
        state.result = null;
      })
      .addCase(startQuiz.fulfilled, (state, action) => {
        state.quizStatus = 'playing';
        state.sessionId = action.payload.sessionId;
        state.questions = action.payload.questions || [];
      })
      .addCase(startQuiz.rejected, (state, action) => {
        state.quizStatus = 'idle';
        state.error = action.payload;
      })
      .addCase(submitQuiz.pending, (state) => {
        state.quizStatus = 'submitting';
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.quizStatus = 'finished';
        state.result = action.payload;
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.quizStatus = 'idle';
        state.error = action.payload;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.history = action.payload;
      })
      .addCase(fetchUserStats.pending, (state) => {
        state.userStatsLoading = true;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.userStatsLoading = false;
        state.userStats = action.payload;
        state.stats = action.payload || state.stats;
      })
      .addCase(fetchUserStats.rejected, (state) => {
        state.userStatsLoading = false;
      })
      .addCase(fetchLeaderboard.pending, (state) => {
        state.leaderboardLoading = true;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.leaderboardLoading = false;
        state.leaderboard = action.payload?.leaderboard || [];
        state.leaderboardSummary = action.payload?.summary || null;
      })
      .addCase(fetchLeaderboard.rejected, (state) => {
        state.leaderboardLoading = false;
      })
      .addCase(fetchJokerInventory.fulfilled, (state, action) => {
        state.inventory = action.payload || initialInventory;
      })
      .addCase(useJoker.fulfilled, (state, action) => {
        const { data, jokerType } = action.payload;

        if (data.success && data.source === 'inventory') {
          state.inventory[jokerType] = Math.max(0, (state.inventory[jokerType] || 0) - 1);
        }
      });
  },
});

export const {
  setSelectedLang,
  selectAnswer,
  nextQuestion,
  eliminateOptions,
  resetQuiz,
  clearQuizError,
} = quizSlice.actions;

export default quizSlice.reducer;
