# Applying Domain-Driven Design (DDD) in Next.js Projects

## Introduction

The goal of applying Domain-Driven Design (DDD) in this Next.js project is to manage complexity and create a more maintainable, scalable, and business-aligned application. By focusing on the core domain of interviewing and hiring, we aim to build a system that accurately reflects the business processes and language.

## Core DDD Concepts

### Ubiquitous Language
- **Definition**: A shared language developed by the team (developers, domain experts, stakeholders) based on the problem domain.
- **Application**: Consistently use terms like "Interview," "Candidate," "Interviewer," "Feedback," "Score," "HiringStage," etc., throughout the codebase, including variable names, function names, class names, and database schemas. This reduces ambiguity and improves communication.

### Bounded Contexts
- **Definition**: Explicit boundaries within which a particular domain model is consistent and well-defined. Different models may apply in different contexts.
- **Application**:
    - **Interview Management**: Handles scheduling, conducting, and feedback collection for interviews.
    - **User Accounts**: Manages user authentication, profiles, and roles (Candidate, Interviewer, Admin).
    - **Resume Management**: Deals with resume parsing, storage, and analysis.
    - **Company Profiles**: Manages information about companies posting jobs or conducting interviews.
    - **Ranking & Matching**: Logic for ranking candidates or matching them to job openings.
- **Next.js Implementation**:
    - Next.js `app` directory routing can help define these boundaries (e.g., `app/interview/(...)`, `app/user/(...)`).
    - Modules within `src/` can further separate the logic for each context (e.g., `src/domain/interview`, `src/domain/user`).

### Layers
- **Definition**: Separating concerns into distinct layers:
    - **Domain Layer**: Contains the core business logic, entities, value objects, domain services, and repository interfaces. This is the heart of the application.
    - **Application Layer**: Orchestrates domain logic to fulfill use cases. It doesn't contain business rules itself.
    - **Infrastructure Layer**: Handles technical concerns like data persistence, external service integrations, and UI rendering.
    - **Presentation Layer**: The UI that users interact with.
- **Next.js Mapping**:
    - **Domain**: `src/domain/`
    - **Application**: API Routes (`app/api/...`), Server Actions, or services called by page components.
    - **Infrastructure**: `src/infrastructure/` (e.g., Supabase clients, external API clients).
    - **Presentation**: Next.js Pages/Routes (`app/`), Server Components, and Client Components.

### Entities
- **Definition**: Objects distinguished by their persistent identity and lifecycle, rather than by their attributes.
- **Examples**: `User`, `Resume`, `Company`, `InterviewSession`, `JobOpening`.
- **Characteristics**: Have an ID, mutable state over time, and tracked through their lifecycle.

### Value Objects
- **Definition**: Immutable objects that describe a characteristic or attribute of the domain. Their identity is based on their values, not a specific ID.
- **Examples**: `Score` (e.g., 1-5), `FeedbackText`, `InterviewSlot` (date/time), `Address`.
- **Characteristics**: Immutable, no identity, often composed to form parts of Entities.

### Aggregates
- **Definition**: A cluster of associated entities and value objects treated as a single unit for data changes. An Aggregate has a root entity (Aggregate Root) which is the only entry point for modifications to the aggregate.
- **Examples**:
    - An `Interview` aggregate might include the `InterviewSession` (root), `InterviewQuestion` entities, `Answer` value objects, and `OverallFeedback` value object.
    - A `CandidateProfile` aggregate might include the `User` (root), `Resume` entity, and `ContactInformation` value object.
- **Purpose**: Ensures consistency within the boundary of the aggregate. Transactions typically occur at the aggregate level.

### Domain Services
- **Definition**: Operations or logic that don't naturally belong to a specific entity or value object. These services encapsulate core business rules that involve multiple domain objects.
- **Examples**:
    - `InterviewSchedulingService`: Handles the logic of finding available slots and booking an interview.
    - `CandidateRankingService`: Implements algorithms to rank candidates based on various criteria.
    - `ResumeParsingService`: Extracts information from uploaded resumes.
- **Characteristics**: Stateless, inputs are typically domain objects, outputs can be domain objects or simple values.

### Repositories
- **Definition**: Abstractions over data persistence mechanisms, providing an interface to retrieve and store aggregates.
- **Application**:
    - Define repository interfaces in the Domain Layer (e.g., `IInterviewRepository`, `IUserRepository`).
    - Implement these interfaces in the Infrastructure Layer (e.g., `SupabaseInterviewRepository`, `SupabaseUserRepository`).
- **Purpose**: Decouples the domain from specific database technologies, making the domain layer more testable and flexible.

### Domain Events
- **Definition**: Objects that represent something significant that has happened in the domain.
- **Examples**: `InterviewScheduled`, `CandidateApplied`, `FeedbackSubmitted`, `UserRegistered`.
- **Purpose**:
    - Decouple Bounded Contexts: An event in one context can trigger actions in another without direct coupling.
    - Side Effects: Useful for handling side effects like sending notifications, updating read models, or integrating with other systems.

## Applying DDD in Next.js

### Directory Structure (Proposed)
```
src/
├── domain/
│   ├── interview/
│   │   ├── entities/
│   │   │   ├── InterviewSession.ts
│   │   │   └── ...
│   │   ├── value-objects/
│   │   │   ├── Score.ts
│   │   │   └── ...
│   │   ├── services/
│   │   │   ├── InterviewAnalysisService.ts
│   │   │   └── ...
│   │   ├── repositories/
│   │   │   ├── IInterviewRepository.ts
│   │   │   └── ...
│   │   └── aggregates/
│   │       └── InterviewAggregate.ts
│   ├── user/
│   │   └── ... (similar structure)
│   └── shared/ (shared kernel - common value objects, types, etc.)
│
├── application/
│   ├── interview/
│   │   ├── usecases/
│   │   │   ├── ScheduleInterviewUseCase.ts
│   │   │   └── ...
│   │   └── dtos/ (Data Transfer Objects)
│   │       └── ScheduleInterviewDTO.ts
│   ├── user/
│   │   └── ...
│
├── infrastructure/
│   ├── persistence/ (e.g., Supabase)
│   │   ├── supabase/
│   │   │   ├── SupabaseInterviewRepository.ts
│   │   │   └── ...
│   │   └── mappers/ (map between domain objects and database models)
│   ├── external-apis/
│   │   └── ...
│
├── app/ (Next.js Presentation Layer)
│   ├── api/
│   │   ├── interview/
│   │   │   └── route.ts (handles requests, calls application services)
│   │   └── ...
│   ├── (interview)/
│   │   ├── schedule/
│   │   │   └── page.tsx
│   │   └── ...
│   └── components/ (UI components)
│
└── lib/ (Utility functions, constants - potentially refactored into domain/shared or infrastructure)
```

### Server Components vs. Client Components
- **Domain Logic**: Should primarily reside in server-side code:
    - Domain entities, services, and repositories are server-side constructs.
    - Application services are called from server-side contexts.
- **Server Components**: Can directly call application services or use server actions that encapsulate application logic. Good for fetching data and performing operations that don't require immediate client-side interactivity.
- **Client Components**: Focus on presentation, user interaction, and managing UI state.
    - They should make requests to API Routes or use Server Actions (which in turn call application services) to interact with the domain.
    - Avoid embedding complex business logic directly in client components.

### API Routes (`app/api/`)
- Serve as the primary entry point from the client-side (or external systems) to the application layer.
- API Route handlers should be lean, validating requests and delegating the core work to application services/use cases.
- They transform data from application services (often domain objects or DTOs) into HTTP responses.

### State Management (Jotai)
- **Global State**: Should primarily store UI-specific state or view models derived from domain data.
- **Domain Objects**:
    - Avoid placing full domain entities directly into global Jotai atoms if these entities are meant to be managed by repositories and have a defined lifecycle.
    - Instead, fetch data through application services/repositories and transform it into appropriate view models for the UI.
- **Synchronization**: If domain state changes on the server, ensure the client-side state (Jotai atoms) is updated, perhaps through re-fetching or server-sent events/WebSockets if real-time updates are needed.
- **Actions**: User actions in the UI that trigger domain logic should call API routes or server actions, which then interact with the application and domain layers. The results can then update Jotai atoms.

## Benefits
- **Maintainability**: Clear separation of concerns makes the codebase easier to understand, modify, and debug.
- **Testability**: Domain logic can be tested independently of UI and infrastructure concerns.
- **Scalability**: Modular design allows different parts of the application to be scaled independently.
- **Business Alignment**: The model directly reflects the business domain, making it easier for developers to communicate with domain experts and implement business requirements accurately.
- **Flexibility**: Easier to adapt to changes in business requirements or technology.

## Challenges
- **Initial Learning Curve**: DDD concepts can be complex to grasp and apply correctly.
- **Potential for Over-Engineering**: For very simple applications, the full DDD structure might be overkill. It's important to apply it judiciously.
- **Team Discipline**: Requires consistent effort from the team to maintain boundaries and adhere to the ubiquitous language.
- **Complexity in Defining Boundaries**: Identifying the correct bounded contexts and aggregates can be challenging.

## Identified Core Domains and Subdomains

Based on the current application structure and functionalities, the following core domains and subdomains are identified:

1.  **Interview Domain**:
    *   **Description**: Manages all aspects of the interview process. This is a central domain for the application.
    *   **Key Functionalities/Entities**: Interview scheduling, question generation (potentially a subdomain or application service), conversation flow management, interview analysis (scoring, feedback), interest tracking during conversation.
    *   **Potential Aggregates**: `InterviewSession` (root, including conversation log, questions, settings), `InterviewAnalysisResult`.
    *   **Related Types from `types.ts`**: `ConversationTypes`, `interviewResultTypes`, `questionsAtom`, `interviewResultAtom`, `SettingTypes`.

2.  **User Domain**:
    *   **Description**: Handles user authentication, user profiles, and potentially user-specific settings not directly tied to an interview.
    *   **Key Functionalities/Entities**: User registration/login, user profile management.
    *   **Potential Aggregates**: `User` (root, including profile information, authentication details).
    *   **Related Types from `types.ts`**: `userAtom`, `UserTypes`.

3.  **Resume Domain**:
    *   **Description**: Manages candidate resumes.
    *   **Key Functionalities/Entities**: Resume creation/storage, parsing resume content (could be an application service using an external tool/AI).
    *   **Potential Aggregates**: `Resume` (root).
    *   **Related Types from `types.ts`**: `ResumeTypes`, `resumeAtom`, `SelectedResumeTypes`.

4.  **Company Domain**:
    *   **Description**: Manages information about companies involved in the interviews.
    *   **Key Functionalities/Entities**: Company profile creation/storage.
    *   **Potential Aggregates**: `Company` (root).
    *   **Related Types from `types.ts`**: `CompanyTypes`, `companyAtom`, `SelectedCompanyTypes`.

5.  **History & Ranking Domain (or could be split)**:
    *   **Description**: Manages past interview records and potentially candidate rankings.
    *   **Key Functionalities/Entities**: Storing historical interview data (linking to Interview, User, Company, Resume), calculating overall scores, generating rankings.
    *   **Potential Aggregates**: `InterviewHistory` (root), `RankingEntry`.
    *   **Related Types from `types.ts`**: `HistoryTableTypes`, `RankingTypes`, `MailContentsTypes` (if mail is about past results).

6.  **OpenAI Interaction Subdomain (or Infrastructure Concern)**:
    *   **Description**: While not a core business domain itself, the interaction with OpenAI for question generation, analysis, and input checking is a significant technical subdomain.
    *   **Consideration**: This might be better modeled as part of the Infrastructure layer, providing services to the relevant domains (e.g., Interview Domain). The subtask report for the previous step already started moving this to `src/infrastructure/ai/` and `src/application/ai/`, which aligns with this.
    *   **Related Files/Types**: `app/api/openai/route.ts`, `utils/callOpenai.ts`, `openaiTypes` (now removed, good!), `utils/analyzeInterviewResult.ts`, `utils/checkUserInput.ts`.

**Note on Subdomains vs. Application Services**: Some functionalities (e.g., "generating questions for an interview," "parsing a resume") might be complex enough to be considered subdomains with their own models, or they might be implemented as Application Services that coordinate entities from core domains and external services (like OpenAI). The decision will be refined during implementation. The key is that the core domain entities (like `InterviewSession` or `Resume`) should not directly depend on the specifics of an external service like OpenAI.
