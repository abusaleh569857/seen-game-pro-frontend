'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Clock, Scissors, SkipForward, Eye, ShieldAlert, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import PageHeader from '@/components/PageHeader';
import ProtectedRoute from '@/components/ProtectedRoute';
import { fetchCategories, fetchLeaderboard, startQuiz } from '@/store/slices/quizSlice';

function ActiveQuizContent() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { 
    questions = [], 
    currentIndex = 0,
    answers = [],
    categories = [],
    leaderboard = [],
    inventory 
  } = useSelector((state) => state.quiz);

  useEffect(() => {
    // Fetch leaderboard if not loaded
    if (leaderboard.length === 0) {
      dispatch(fetchLeaderboard());
    }
    // Fetch categories if missing
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, leaderboard.length, categories.length]);

  const currentQues = questions[currentIndex] || {};
  const totalQuestions = questions.length || 10;
  const currentQNumber = currentIndex + 1;

  // Get dynamic category name based on the current question's category_id
  const currentCategoryObj = categories.find(c => c.id == currentQues.category_id);
  const currentCategoryName = currentCategoryObj ? currentCategoryObj.name_en : 'Quiz';

  // Local State for interactive gameplay mechanics (Real-time)
  const [timeLeft, setTimeLeft] = useState(18);
  const [score, setScore] = useState(300);
  const [correctCount, setCorrectCount] = useState(3);
  const [wrongCount, setWrongCount] = useState(0);
  const [streak, setStreak] = useState(3);
  const [selectedOption, setSelectedOption] = useState(null);
  const [liveRankings, setLiveRankings] = useState([]);
  
  // Array to hold status of each question index: 'correct', 'wrong', 'pending'
  const [questionMapStatus, setQuestionMapStatus] = useState(
    Array(totalQuestions).fill('pending').map((_, i) => i < 3 ? 'correct' : 'pending')
  );

  // Transform API leaderboard data and inject current user's simulated progress
  useEffect(() => {
    if (leaderboard.length > 0) {
      const dbPlayers = leaderboard.slice(0, 5).map((l, i) => ({
        id: `db-${l.id}`,
        name: l.username,
        points: parseInt(l.points) || 0,
        initial: l.username?.charAt(0).toUpperCase() || 'U',
        color: ['bg-orange-500', 'bg-blue-600', 'bg-teal-500', 'bg-pink-600', 'bg-gray-800'][i % 5],
        isYou: l.username === user?.username
      }));

      // If user isn't in top 5 natively, push them to the end of the array to animate their climb
      const hasUser = dbPlayers.some(p => p.isYou);
      if (!hasUser && user) {
        dbPlayers.push({
          id: 'you-local',
          name: user.username,
          points: score, // use local dynamic score
          initial: user.username?.charAt(0).toUpperCase() || 'U',
          color: 'bg-violet-600',
          isYou: true
        });
      } else if (hasUser) {
        // Update user's score if they are already in the array
        const userObj = dbPlayers.find(p => p.isYou);
        if (userObj) userObj.points = score;
      }

      setLiveRankings(dbPlayers.sort((a, b) => b.points - a.points).slice(0, 5));
    }
  }, [leaderboard, score, user]);

  useEffect(() => {
    setQuestionMapStatus((current) => {
      if (current.length === totalQuestions) {
        return current;
      }

      return Array(totalQuestions)
        .fill('pending')
        .map((_, i) => current[i] || (i < 3 ? 'correct' : 'pending'));
    });
  }, [totalQuestions]);

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-bold">Loading Quiz Arena...</p>
        <button 
          onClick={() => router.push('/categories')}
          className="mt-6 text-violet-600 font-semibold underline text-sm"
        >
          Return to Categories
        </button>
      </div>
    );
  }

  // Handle User Answer
  const handleAnswerSelect = (optionKey) => {
    if (selectedOption) return; // Prevent double click
    
    setSelectedOption(optionKey);
    // Determine if correct. Assuming currentQues.correct_answer holds 'A', 'B', etc.
    const isCorrect = optionKey.toUpperCase() === currentQues.correct_answer;

    if (isCorrect) {
      setScore(prev => prev + 100); // Dynamic score increase
      setCorrectCount(prev => prev + 1);
      setStreak(prev => prev + 1);
      updateQuestionMap(currentIndex, 'correct');
    } else {
      setWrongCount(prev => prev + 1);
      setStreak(0); // Reset streak
      updateQuestionMap(currentIndex, 'wrong');
    }
  };

  const updateQuestionMap = (index, status) => {
    setQuestionMapStatus(prev => {
      const newMap = [...prev];
      newMap[index] = status;
      return newMap;
    });
  };

  const handleNext = () => {
    // Dispatch next question logic here later
    setSelectedOption(null);
    setTimeLeft(20);
  };

  // UI Helper: Get dynamic style for an option box
  const getOptionStyle = (optionKey) => {
    const isSelected = selectedOption === optionKey;
    if (!isSelected) {
      return "bg-white border-gray-100 hover:border-violet-300 hover:bg-violet-50 text-gray-700";
    }
    return "bg-[#F3E8FF] border-violet-400 text-gray-900"; // Selected/Active styling
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <PageHeader 
        pageName="Active Quiz" 
        breadcrumbs={[ { label: 'Category Grid', href: '/categories' } ]} 
      />

      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 pb-12 mt-4 lg:mt-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* ────── LEFT MAIN COLUMN (Quiz Engine) ────── */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            
            {/* Top Info Bar: Category Pill & Progression */}
            <div className="flex flex-col gap-3 px-1">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-100/50 text-violet-700 text-[12px] font-bold border border-violet-200">
                  <div className="w-4 h-4 rounded-full bg-violet-500/20 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-600" />
                  </div>
                  {currentCategoryName}
                </span>
                <span className="text-[14px] font-bold text-gray-800">
                  Question <span className="text-gray-900 font-black">{currentQNumber}</span> of {totalQuestions}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${(currentQNumber / totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            {/* Top Stats Cards Row */}
            <div className="grid grid-cols-4 gap-3 lg:gap-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 lg:p-4 flex items-center gap-3">
                <div className="relative w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center">
                  {/* SVG Timer Ring */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="50%" cy="50%" r="45%" className="fill-none stroke-orange-100 stroke-[3]" />
                    <circle cx="50%" cy="50%" r="45%" className="fill-none stroke-orange-500 stroke-[3] transition-all" strokeDasharray="100" strokeDashoffset="20" />
                  </svg>
                  <span className="text-[13px] lg:text-[15px] font-black text-orange-600">{timeLeft}</span>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider font-bold text-gray-400">Time Left</p>
                  <p className="text-[18px] lg:text-[22px] font-black text-gray-900 leading-none mt-0.5">{timeLeft}</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 flex flex-col justify-center items-center text-center">
                <p className="text-[9px] uppercase tracking-wider font-bold text-gray-400">Score</p>
                <p className="text-[20px] lg:text-[26px] font-black text-gray-900 mt-0.5 transition-all">{score}</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 flex flex-col justify-center items-center text-center">
                <p className="text-[9px] uppercase tracking-wider font-bold text-gray-400">Correct</p>
                <p className="text-[20px] lg:text-[26px] font-black text-green-500 mt-0.5 transition-all">{correctCount}</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 flex flex-col justify-center items-center text-center">
                <p className="text-[9px] uppercase tracking-wider font-bold text-gray-400">Wrong</p>
                <p className="text-[20px] lg:text-[26px] font-black text-red-500 mt-0.5 transition-all">{wrongCount}</p>
              </div>
            </div>

            {/* STREAK */}
            <div className="flex justify-end -mt-1 px-1">
               <div className="flex items-center gap-1.5 text-[14px]">
                 <span className="font-bold text-gray-400 text-[11px] uppercase tracking-widest">Streak</span>
                 <span className="font-black text-orange-500 flex items-center gap-1">🔥 {streak}</span>
               </div>
            </div>

            {/* Question Card & Area */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 pt-8 pb-6 px-6 lg:px-10 flex flex-col items-center">
              <span className="inline-block px-3 py-1 bg-violet-50 text-violet-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-6">
                Question 0{currentQNumber}
              </span>
              <h2 className="text-[20px] lg:text-[24px] font-black text-gray-900 text-center leading-[1.4] max-w-2xl mb-8">
                {currentQues.question_text}
              </h2>

              {/* Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {['a', 'b', 'c', 'd'].map((optKey) => {
                  const val = currentQues[`option_${optKey}`];
                  const label = optKey.toUpperCase();
                  return (
                    <button
                      key={optKey}
                      onClick={() => handleAnswerSelect(optKey)}
                      className={`flex items-center p-4 rounded-2xl border-2 transition-all ${getOptionStyle(optKey)}`}
                      disabled={!!selectedOption}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black mr-4 text-[15px] transition-colors ${
                        selectedOption === optKey ? 'bg-violet-500 text-white shadow-sm shadow-violet-500/30' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {label}
                      </div>
                      <span className="text-[15px] font-bold text-left">{val}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Joker Dock Bottom Bar */}
            <div className="mt-2 w-full rounded-3xl bg-gradient-to-r from-[#1E1260] via-[#241768] to-[#120B3B] p-5 lg:p-6 flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-xl shadow-indigo-900/10">
              
              <div className="flex flex-col z-10 text-center lg:text-left">
                <div className="flex items-center gap-2 mb-1 justify-center lg:justify-start">
                   <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">🪙</div>
                   <span className="text-[#FCD34D] font-black text-sm">{user?.qeemBalance || 24}</span>
                </div>
                <h3 className="text-white text-lg font-black tracking-wide">POWER-UPS</h3>
                <p className="text-white/50 text-[12px] font-medium">Use wisely</p>
              </div>

              {/* Joker Pills */}
              <div className="flex items-center gap-3 lg:gap-4 z-10 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                
                {/* 50/50 */}
                <button className="relative flex flex-col items-center justify-center w-20 lg:w-[90px] h-[100px] rounded-[20px] bg-indigo-500/20 border border-indigo-400/30 hover:bg-indigo-500/30 transition group">
                   <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#8B5CF6] border-2 border-[#1E1260] flex items-center justify-center text-white text-[10px] font-black shadow-md">2</div>
                   <Scissors className="w-5 h-5 text-indigo-300 mb-2 group-hover:scale-110 transition" />
                   <span className="text-white text-[12px] font-bold">50 / 50</span>
                   <span className="text-indigo-200/50 text-[9px] block text-center leading-tight mx-2 mt-1">Remove 2 wrong answers</span>
                </button>

                {/* Skip */}
                <button className="relative flex flex-col items-center justify-center w-20 lg:w-[90px] h-[100px] rounded-[20px] bg-cyan-500/10 border border-cyan-400/30 hover:bg-cyan-500/20 transition group">
                   <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#3B82F6] border-2 border-[#1E1260] flex items-center justify-center text-white text-[10px] font-black shadow-md">1</div>
                   <SkipForward className="w-5 h-5 text-cyan-300 mb-2 group-hover:scale-110 transition" />
                   <span className="text-white text-[12px] font-bold">Skip</span>
                   <span className="text-cyan-200/50 text-[9px] block text-center leading-tight mx-2 mt-1">Jump to the next question</span>
                </button>

                {/* Time */}
                <button className="relative flex flex-col items-center justify-center w-20 lg:w-[90px] h-[100px] rounded-[20px] bg-green-500/10 border border-green-400/30 hover:bg-green-500/20 transition group">
                   <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#10B981] border-2 border-[#1E1260] flex items-center justify-center text-white text-[10px] font-black shadow-md">1</div>
                   <Clock className="w-5 h-5 text-green-400 mb-2 group-hover:scale-110 transition" />
                   <span className="text-white text-[12px] font-bold">+10 Sec</span>
                   <span className="text-green-200/50 text-[9px] block text-center leading-tight mx-2 mt-1">Add extra time to clock</span>
                </button>

                {/* Reveal (Empty State) */}
                <button className="relative flex flex-col items-center justify-center w-20 lg:w-[90px] h-[100px] rounded-[20px] bg-red-500/5 border border-red-500/20 transition group opacity-60">
                   <div className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full bg-[#EF4444] border-2 border-[#1E1260] flex items-center justify-center text-white text-[8px] font-black max-w-[40px]">EMPTY</div>
                   <Eye className="w-5 h-5 text-red-400 mb-2" />
                   <span className="text-white/60 text-[12px] font-bold">Reveal</span>
                   <span className="text-red-200/30 text-[9px] block text-center leading-tight mx-2 mt-1">Show correct answer</span>
                </button>
              </div>

              {/* Next Button */}
              <button 
                onClick={handleNext}
                disabled={!selectedOption}
                className={`z-10 flex items-center justify-center gap-1.5 px-6 py-3.5 rounded-2xl font-bold text-[14px] transition-all ml-auto ${
                  selectedOption 
                    ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/30' 
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                }`}
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
          </div>

          {/* ────── RIGHT WIDGETS COLUMN ────── */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* 1. Question Map Grid */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 relative">
               <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">QUESTION MAP</h3>
               <div className="grid grid-cols-5 gap-2 lg:gap-3">
                 {questionMapStatus.map((status, idx) => {
                    const num = idx + 1;
                    const isActive = currentIndex === idx;
                    
                    let blockStyle = "bg-gray-50 border-gray-100 text-gray-400"; // default pending
                    let content = num;

                    if (status === 'correct') {
                      blockStyle = "bg-green-50 border-green-200 text-green-500";
                      content = "✓";
                    } else if (status === 'wrong') {
                      blockStyle = "bg-red-50 border-red-200 text-red-500";
                      content = "✕";
                    }

                    if (isActive) {
                      blockStyle = "bg-violet-50 border-violet-400 text-violet-600 ring-2 ring-violet-100 shadow-sm";
                    }

                    return (
                      <div 
                        key={idx}
                        className={`aspect-square rounded-xl border flex items-center justify-center text-[14px] font-black transition-colors ${blockStyle}`}
                      >
                        {content}
                      </div>
                    );
                 })}
               </div>
            </div>

            {/* 2. Live Ranking */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col h-full min-h-[300px]">
               <div className="flex items-center justify-between mb-5">
                 <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">LIVE RANKING</h3>
                 <span className="flex items-center gap-1 text-[10px] font-bold text-red-500">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> LIVE
                 </span>
               </div>
               
               <div className="flex flex-col relative w-full h-[250px]">
                 {liveRankings.map((player, idx) => {
                   // Calculate vertical position (absolute positioning for smooth visual reorder)
                   const topPosition = idx * 52; // 52px height + gap per item
                   
                   return (
                     <div 
                       key={player.id}
                       className="absolute left-0 right-0 h-10 flex items-center justify-between transition-all duration-500 ease-in-out"
                       style={{ top: `${topPosition}px` }}
                     >
                       <div className="flex items-center gap-3">
                         <span className="text-[12px] font-bold text-gray-400 w-3 text-center">{idx + 1}</span>
                         <div className={`w-8 h-8 rounded-full ${player.color} flex items-center justify-center text-white text-[11px] font-black`}>
                           {player.initial}
                         </div>
                         <span className={`text-[13px] font-bold ${player.isYou ? 'text-violet-600' : 'text-gray-800'}`}>
                           {player.name} {player.isYou && '(You)'}
                         </span>
                       </div>
                       <span className={`text-[14px] font-black ${player.isYou ? 'text-violet-600' : 'text-gray-900'}`}>
                         {player.points}
                       </span>
                     </div>
                   );
                 })}
               </div>
            </div>

            {/* 3. Joker Inventory */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">JOKER INVENTORY</h3>
              <div className="flex flex-col gap-3">
                 <div className="flex justify-between items-center text-[12px] font-semibold text-gray-700">
                   <div className="flex items-center gap-2">
                     <Scissors className="w-3.5 h-3.5 text-gray-400" /> 50/50
                   </div>
                   <span className="font-bold text-gray-900">× 2</span>
                 </div>
                 <div className="flex justify-between items-center text-[12px] font-semibold text-gray-700">
                   <div className="flex items-center gap-2">
                     <SkipForward className="w-3.5 h-3.5 text-gray-400" /> Skip
                   </div>
                   <span className="font-bold text-gray-900">× 1</span>
                 </div>
                 <div className="flex justify-between items-center text-[12px] font-semibold text-gray-700">
                   <div className="flex items-center gap-2">
                     <Clock className="w-3.5 h-3.5 text-gray-400" /> +10s Time
                   </div>
                   <span className="font-bold text-gray-900">× 1</span>
                 </div>
                 <div className="flex justify-between items-center text-[12px] font-semibold text-red-500">
                   <div className="flex items-center gap-2">
                     <Eye className="w-3.5 h-3.5" /> Reveal
                   </div>
                   <span className="font-bold text-red-500">× 0</span>
                 </div>
              </div>
              <button className="w-full mt-5 py-2.5 rounded-xl border-2 border-violet-100 text-violet-600 text-[12px] font-bold hover:bg-violet-50 transition flex items-center justify-center gap-2">
                🪙 Buy More Jokers
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}


export default function ActiveQuizPage() {
  return (
    <ProtectedRoute>
      <ActiveQuizContent />
    </ProtectedRoute>
  );
}
