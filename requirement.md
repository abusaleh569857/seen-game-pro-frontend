# 📄 Developer Technical Brief: Seen Game Pro

**Project Name:** Seen Game Pro
**Document Version:** 1.1 (Revised Scope)
**Project Scope:** Phase 1 (Monetization MVP) + Phase 2 (Social Ecosystem)
**Target Market:** Arabic (Default), English, French, Spanish.
**Budget Focus:** Revenue generation, AI-automation, and user retention.

---

## 1. Project Overview
**Seen Game Pro** is an interactive, multilingual quiz platform. The platform relies on a **Question Bank architecture** for speed (using an AI-driven Question Bank to minimize content costs) combined with a monetization system (Shop & Jokers) to maximize revenue from day one.

*   **Objective:** A fast, profitable platform ready for market launch.
*   **Content Restrictions:** 🚫 Strict prohibition on content, keywords, or references related to **Israel** or **Iran**.

---

## 2. The 20-Screen UI/UX Architecture
To be designed Mobile-First with RTL (Right-to-Left) support for Arabic.

### Phase 1: Core & Revenue (12 Screens)
1.	**Landing/Welcome:** Entry point with language selection.
2.	**Login:** Email/Username access.
3.	**Sign-Up:** User registration.
4.	**Category Grid:** The 15 categories (Sports, History, Science, etc.).
5.	**Active Quiz Interface:** The game engine (Question, Timer, Answer Buttons).
6.	**Joker Dock/Menu:** UI to trigger 50/50, Skip, Time, or Reveal.
7.	**Joker Purchase Modal:** Quick-buy pop-up if user is out of Jokers.
8.	**Result Screen:** Score summary, points earned, and "Play Again."
9.	**The Shop:** Packages (Small 1.5 KWD to Giant 9 KWD).
10.	**Tap Payment Gateway:** Secure checkout interface.
11.	**User Profile:** Personal stats, game history, and Qeem balance.
12.	**Global Leaderboard:** Top player rankings.

### Phase 2: Social & VIP Expansion (8 Screens)
13.	**VIP Subscription Hub:** Recurring monthly plan sales page.
14.	**Friends List & Search:** Add/Manage friends and see online status.
15.	**Public User Profile:** View others with "Challenge" and "Gift" buttons.
16.	**Qeem Transfer UI:** Secure interface to send coins to friends.
17.	**Challenge Lobby:** List of pending 1v1 wagers from friends.
18.	**Group/Team Home:** "Clan" page for group rankings and total points.
19.	**Tournament Arena:** UI for live-scheduled group competitions.
20.	**Notification Center:** Alerts for challenges, friend requests, and VIP status.

---

## 3. Scope of Work (Phase 1)
This phase focuses on launching a fully functional product with revenue streams.

### A. Core Features
1.  **User System:** Auth, Profile, Statistics.
2.  **Quiz Engine:** Gameplay (10 questions), Timer, Categories.
3.  **Question Bank (AI):** Admin tool to generate questions via OpenAI (fetching from DB during play).
4.  **Monetization System (Crucial for Phase 1):**
    *   **Shop Page:** Display Qeem packages.
    *   **Tap Payment Integration:** Integrate Tap Payment Gateway (API provided by client).
    *   **Joker System:** Logic for 50/50, Skip, Time, Reveal (Deduct from inventory or balance).
5.  **Leaderboard:** Basic ranking.

### B. Categories (15 Total)
The system must support the following categories:

| # | Category (EN) | Category (AR) |
|---|--- |--- |
| 1 | Sports | رياضة |
| 2 | History | تاريخ |
| 3 | Science | علوم |
| 4 | Geography | جغرافيا |
| 5 | Culture | ثقافة |
| 6 | Arts | فنون |
| 7 | Entertainment | ترفيه |
| 8 | Nature | طبيعة |
| 9 | Technology | تقنية |
| 10 | Food | طعام |
| 11 | Cars | سيارات |
| 12 | Business | أعمال |
| 13 | Games | ألعاب |
| 14 | Music | موسيقى |
| 15 | General | عام |

### C. Monetization & Shop (Exact Pricing)
The Shop page must display these exact packages:

| Package | Qeem Amount | Price (KWD) |
| :--- | :--- | :--- |
| Small | 5 Qeem | 1.5 KWD |
| Medium | 10 Qeem | 2.5 KWD |
| Large | 25 Qeem | 5 KWD |
| Giant | 50 Qeem | 9 KWD |

---

## 4. Technical Logic & Database

### A. Database Schema (Key Tables)

```sql
-- Users Table (Includes Balance)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    qeem_balance DECIMAL(10, 2) DEFAULT 0.00,
    points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Questions Table (The Archive)
CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    language_code VARCHAR(10) DEFAULT 'ar',
    question_text TEXT NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    correct_answer ENUM('A', 'B', 'C', 'D') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Transactions Table (To record Tap Payments)
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2),
    qeem_added INT,
    tap_ref VARCHAR(255), -- Reference ID from Tap
    status ENUM('success', 'failed') DEFAULT 'success',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### B. Joker & Balance Logic (Inventory vs Balance)
```javascript
function useJoker(userId, jokerType) {
    // 1. Check Inventory
    let inventory = getJokerInventory(userId, jokerType);

    if (inventory > 0) {
        consumeInventory(userId, jokerType);
        return { success: true, source: "inventory" };
    } else {
        // 2. Check Qeem Balance
        let cost = getJokerCost(jokerType);
        if (userBalance >= cost) {
            deductBalance(userId, cost);
            executeJokerEffect();
            return { success: true, source: "balance" };
        } else {
            showShopModal(); // Return to prompt the user to buy Qeem
            return { success: false, message: "Insufficient Balance" };
        }
    }
}
```

---

## 5. AI Integration (OpenAI Prompt)

**Important:** Generate questions in the backend/Admin Panel automatically and save to DB in batches.

*   **Target:** 10 Questions per batch.
*   **Prompt Template:**
```text
You are the official Quiz Master for "Seen Game Pro".
Generate a JSON array of 10 trivia questions in [TARGET_LANGUAGE] for category: [CATEGORY_NAME].

OUTPUT FORMAT:
[ { "question": "...", "options": {"A":"...", "B":"...", "C":"...", "D":"..."}, "correct_answer": "A", "difficulty": "medium" } ]

CONTENT RULES:
1. Culturally appropriate for Arab/Islamic regions.
2. 🚫 CRITICAL: NO content related to Israel, Iran, Hebrew, or Persian.
```

---

## 6. System Requirements
*	**Backend:** Node.js (Express) or PHP (Laravel).
*	**Database:** MySQL 8.0 (utf8mb4 for Arabic support).
*	**Payments:** Tap Payment API Integration (KWD Currency).
*	**Hosting:** VPS with SSL (Required for Tap API).

---

## 7. Phase 2 Advanced Features
*	**VIP System:** Monthly recurring revenue.
*	**Coin Transfer:** P2P gifting between friends.
*	**Challenges:** 1v1 wagering system with "Frozen Balance" logic until a winner is declared.
*	**Groups:** Aggregated scoring for community leaderboards.

---

## 8. Client Responsibilities (What is Provided)
1.  **Domain & Hosting:** Purchased and ready.
2.  **OpenAI API Key:** Provided for question generation.
3.  **Tap Payment Account:** API Keys and integration details provided.

---

## 9. Acceptance Criteria (For Final Delivery)
1.	**Payment Success:** A user can buy Qeem and the balance updates instantly.
2.	**RTL Perfection:** The Arabic layout must be flawless on mobile.
3.	**AI Accuracy:** Admin can generate 10 questions and save them to the DB with one click.
4.	**Security:** No user can "hack" their point total or Qeem balance in the frontend.
5.  **Full Source Code:** Ownership transferred to Client.
