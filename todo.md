# DDD Refactoring TODO

- [x] Research DDD Best Practices in Next.js
- [x] Define Core Domains and Subdomains
- [x/w] Create Domain Layer Structure (Completed, ongoing for Application/Infrastructure as needed)
- [x] Define Entities and Value Objects (Initial types moved from `types.ts` to domain files, class-based VOs created)
- [x/w] Implement Domain Services (Initial services created, `InterviewService`, `HistoryService`, and `InterviewInteractionService` added, replacing utils)
- [x/w] Implement Repositories (Initial interfaces defined, Supabase implementations for History, AnalysisResult, ConversationLog started)
- [w] Refactor Application Layer (API Routes and Page Components) (OpenAI route refactored, ongoing)
- [x/w] Refactor Utility Functions (Type definitions refactored, `analyzeInterviewResult.ts`, `addToHistory.ts`, & `checkUserInput.ts` moved to domain services, ongoing)
- [ ] Update State Management (Jotai Atoms)
- [ ] Add Unit/Integration Tests
- [ ] Review and Iterate
- [x] Update `todo.md` (mark completed tasks)
- [ ] Submit Changes
