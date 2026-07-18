# Frontend Integration Guide: Advanced Automation Features

Now that the backend features for Loomingo are fully implemented, this document outlines the exact modifications required in your React frontend (`AutoDMManager.tsx` and `CreationModal.tsx`) to surface these new capabilities to the user while maintaining your existing premium workflow.

---

## 1. Goal 1: 5-Comment Round-Robin Replies

**Backend Context:** The `AutomationRuleDTO` no longer relies solely on a single `commentText` string. It now accepts and parses a `List<String> commentReplies` array.

### UI Modifications (Step 1: Triggers & Comment)
- **Current State:** A single `<textarea>` for "What to reply".
- **New State:** Convert this into a dynamic list builder (similar to how you handle the "Attached Links Builder" in Step 3).
  - By default, show one textarea pre-filled with *"Thanks for commenting! Check your DMs 🚀"*.
  - Add an **"Add Another Variation"** button below it.
  - Allow the user to add up to 5 textareas.
  - Include a small trash icon next to each (except the first one) to remove variations.
  - **Helper Text:** Add a tooltip saying: *"Add multiple replies! We'll cycle through them randomly so Instagram doesn't flag you for spam."*

### Payload Update
When constructing the API payload for `/api/v1/automation/new/rule`, map the textareas to an array:
```json
{
  "commentReplies": [
    "Thanks for commenting! Check your DMs 🚀",
    "Sent you a DM! Check your requests.",
    "Just sent it over! 🙌"
  ]
}
```

---

## 2. Goal 2: Specific Post vs. Global "Any Post" Overrides

**Backend Context:** The backend routing engine now supports falling back to global rules if a specific post rule isn't found. The `AutomationRuleDTO` now accepts a `targetMediaId`.

### UI Modifications (Step 0: Select Post)
- **Current State:** A grid of Instagram posts fetched from the connected account.
- **New State:** 
  - Add a prominent, styled "Universal / Any Post" card at the very beginning of the media grid.
  - **Helper Text:** *"Want this to trigger on every post? Select 'Any Post' and it will apply to your entire profile."*
  - If a user selects a specific post from the grid, it functions exactly as it does now (binding the automation strictly to that media ID, which will now bypass global keywords).

### Payload Update
- If they select a specific post, pass the media ID as normal into `targetMediaId` and `media.mediaId`.
- If they select the "Universal" card, pass a generic identifier (e.g., `targetMediaId: null` or a specific `"GLOBAL"` string depending on how your frontend state manages the null selection) so the backend flags it as a universal rule.

---

## 3. Goal 3: Fuzzy Emoji Matching

**Backend Context:** The backend now utilizes advanced Regex validation to parse triggers. It is case-insensitive and perfectly isolates Unicode emojis (like `🙌`) even if they are buried in a long comment.

### UI Modifications (Step 1: Triggers & Comment)
- **Current State:** A standard tag-input field for keywords.
- **New State:** 
  - Update the placeholder text inside the tag-input to say: *"Type a keyword or emoji (e.g. 'Link', 🎁, 🙌) and press Enter"*
  - **Helper Text:** Update the instructions below the input: *"Pro Tip: Emojis work perfectly! Users don't need to type the exact word—if they include your emoji anywhere in their comment, we'll catch it."*

---

## 4. Goal 4: Dashboard Metrics Updates

**Backend Context:** The backend is now actively tracking `totalCommentsTriggered` (top of funnel) asynchronously, and computing `baselineFollowers` via a scheduled snapshot.

### UI Modifications (Dashboard Data Loading)
- **Current State:** Header displays "Total DMs Sent", "Total Followers Gained", and "Active Automations Count".
- **New State:**
  - **Rename Metric:** Change "Active Automations Count" to **"Total Comments Triggered"**.
  - **Followers Tooltip:** Add a subtle info icon (`ℹ️`) next to the "Total Followers Gained" metric. When hovered, display the tooltip: *"Calculated as total account growth since your automations were first activated. Due to Meta restrictions, this tracks overall growth rather than direct DM attribution."*
  - Ensure your frontend DTO model maps the new `totalCommentsTriggered` integer coming from the `/api/auto-dm/automations/dashboard/{businessId}` endpoint.
