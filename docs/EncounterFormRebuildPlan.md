# Encounter Form Rebuild Plan

This document outlines the plan to rebuild the legacy encounter form page, transitioning from `encounter-basic-info.component.ts` to the new, streamlined `encounter-form-page.component.ts`. The goal is to modernize the implementation, improve user experience, and simplify the complex logic of the original component.

## Analysis of Legacy Component (`encounter-basic-info.component.ts`)

The legacy component is a large, complex component responsible for creating and managing all aspects of an encounter. Its functionality can be broken down into the following key areas:

### 1. Core Encounter Details

This section handles the primary information about the encounter itself.

-   **Fields:**
    -   `ServiceTypeId`: The type of service being provided (e.g., Treatment/Therapy, Evaluation, Other Non-Billable).
    -   `EvaluationTypeId`: If the service type is an evaluation, this specifies the type.
    -   `NonMspServiceTypeId`: If the service type is "Other Non-Billable", this specifies the service.
    -   `EncounterDate`: The date of the encounter.
    -   `EncounterStartTime` & `EncounterEndTime`: The start and end times of the encounter.
    -   `AdditionalStudents`: The number of additional students in a group session.
    -   `EncounterLocation`: The location where the encounter took place (e.g., School).
-   **Implementation:**
    -   The form is built using a proprietary dynamic form system (`EncounterDynamicConfig`, `@mt-ng2/dynamic-form`).
    -   There is complex logic to show/hide fields based on the selected `ServiceTypeId`.
    -   Date and time controls have custom validation (e.g., cannot be in the future, cannot be between 12am-4am, duration cannot exceed 8 hours).
    -   Timezone handling is done manually via a service (`DateTimeConverterService`) to convert times to/from a fixed timezone (Eastern Time).

### 2. Student Management

This is a major part of the component, handling which students participated in the encounter.

-   **Adding Students:**
    -   A typeahead search box allows the provider to find and select students.
    -   Providers can switch between searching their personal "Caseload" or "All Students" in the system.
    -   The list of available students is filtered to exclude those already in the current encounter.
    -   There is a workflow to add a student to the provider's caseload directly from the encounter page if they aren't already assigned. This opens a separate modal.
-   **Removing Students:**
    -   Students can be removed from an existing encounter.
-   **Display:**
    -   Added students are displayed in a list or grid format.
    -   The component groups the list of students for responsive display (`groupArray` function).

### 3. Student-Specific Information & Forms

For each student in the encounter, the provider can enter specific details.

-   **Functionality:**
    -   The component dynamically generates a sub-form for each student.
    -   These forms capture details like therapy notes, CPT codes, and `StudentDeviationReasonId` (if the student was present but did not receive the planned service).
-   **Implementation:**
    -   Uses another dynamic form configuration (`EncounterStudentDynamicConfig`) to create these student-specific forms.
    -   This allows for different form structures based on the encounter type or other logic.

### 4. Saving & Validation Logic

The component contains a sophisticated, multi-layered validation and saving process.

-   **Validation Engine:**
    -   It uses custom, chainable validation handlers (`runEncounterValidationChain`, `runESignatureValidationChain`).
    -   These handlers check a complex set of business rules before saving or e-signing.
    -   Examples: Student must have a valid service plan, provider must have a supervisor for the student (if assistant), etc.
    -   Validation errors are presented to the user in a modal (`ValidationModalService`), which can distinguish between "soft" warnings and "hard" errors that block saving.
-   **Overlap Validation:**
    -   Before saving, it checks if the proposed encounter date/time overlaps with any existing encounters for the selected students.
    -   If an overlap is detected, it prompts the user for confirmation.
-   **Saving Workflow:**
    -   There are multiple save functions (`saveAllEncounters`, `updateEncounter`, `updateAllEncounters`, `createStudentEncounters`).
    -   The logic handles creating a new encounter, updating an existing one, adding new students to an existing encounter, and updating the details for multiple students at once.
    -   The component manages many `Observable` streams using `forkJoin` and `concat` to perform multiple API calls in sequence or parallel.

### 5. E-Signature

E-signing is a critical workflow with its own dedicated logic.

-   **Process:**
    -   After an encounter is saved, it can be e-signed.
    -   The e-sign process runs its own validation chain (`runESignatureValidationChain`).
    -   If validation passes, a modal appears (`ElectronicSignatureModalService`) displaying the official signature text, which the provider confirms.
-   **Logic:**
    -   The component determines if an encounter or a group of encounters `canBeSigned`.
    -   Upon successful signing, the encounter status is updated to "E-Signed", and the provider's signature is recorded.

### 6. Data and State Management

The component is highly stateful and responsible for fetching all its own data.

-   **Initial Data Loading:**
    -   On initialization (`ngOnInit`), it uses a `forkJoin` to load all necessary lookup data:
        -   `IEncounterLocation[]`
        -   `IStudentDeviationReason[]`
        -   `IEncounterStatus[]`
        -   `IESignatureContent`
        -   `ISelectOptions[]` (for students)
        -   `INonMspService[]`
        -   `ISelectOptions[]` (for school districts)
-   **State Management:**
    -   It uses over 50 class properties to manage component state, including boolean flags, data arrays, form objects, and temporary variables for various workflows (e.g., `isEditingEncounterDateTime`, `showOverlapModal`, `doubleClickIsDisabled`). This makes the component's state difficult to track.

### 7. Group Encounters

The component has specific logic to handle group encounters (more than one student).

-   **`IsGroup` Flag:** It calculates and maintains an `IsGroup` flag on the encounter.
-   **CPT Codes:** When the group status changes (e.g., by adding or removing a student), it triggers an update to the CPT codes for the entire encounter to ensure correct billing.

### 3. Per-Student Data Management

The most complex part of the legacy form is the per-student data entry. The old form uses several sub-components (`encounter-student-goals`, `encounter-student-cpt-codes`, `encounter-student-methods`) inside each expandable student row. This creates a cluttered UI and makes state management difficult.

#### 3.1 Analysis of Legacy Sub-Components

A detailed analysis of the legacy sub-components reveals varying levels of complexity:

*   **`encounter-student-goals`**: This is the most complex component. For each Goal selected for a student, the user must also provide additional data, including a "Service Outcome", "Progress Code", and free-text notes. It's a multi-step data entry process for each selected goal.
*   **`encounter-student-cpt-codes`**: This component is moderately complex. After selecting one or more CPT codes, the user must specify the number of `Minutes` to be allocated to each code. The UI has logic to auto-fill minutes if only one code is selected, but requires manual entry for multiple codes.
*   **`encounter-student-methods`**: This component is the simplest. It is a pure selection list. The user selects one or more applicable methods, and no further data is required for each selection.

#### 3.2 The "Manager" Dialog Pattern

Given the complexity and variation found in the sub-components, stuffing this functionality directly into the expandable table row is not feasible. The new design will adopt a **"Manager" Dialog Pattern**.

*   For each student in the table, the expanded area will **not** contain complex forms. Instead, it will show a simple, read-only summary of the selected data (e.g., a list of selected Goal names).
*   Next to each summary list, a button (e.g., `[+ Manage Goals]`) will be present.
*   Clicking this button will open a **full-screen modal dialog**. This dialog will be a dedicated "manager" component for that specific data type (e.g., `GoalManagerComponent`).

This approach has several advantages:
- It keeps the main encounter form UI clean and focused on the session list.
- It encapsulates the unique complexity of each data type (Goals, CPTs, Methods) into its own dedicated, reusable component.
- It provides a much larger and more user-friendly canvas (a full-screen dialog) for the complex data entry required for Goals and CPT Codes.

#### 3.3 Manager Component Design

All "Manager" components will follow a consistent two-panel layout:

*   **Left Panel**: A list of *available* items to be selected (e.g., all of the student's available goals). This panel will include search and filtering capabilities.
*   **Right Panel**: A list of the *selected* items. This is where the user will manage the details for each selection.
    *   For **Goals**, selecting an item in the right panel will display a form to edit its outcome, progress, and notes.
    - For **CPT Codes**, the right panel will show the list of selected codes with an input field for `Minutes` next to each.
    - For **Methods**, the right panel will simply be a list of the selected methods, with a button to remove them.

This consistent layout will provide a predictable and intuitive user experience across all data management tasks.

---

## Proposed Plan for New Component (`encounter-form-page.component.ts`)

*(This section will be developed further. The initial focus is to rebuild the core functionality in a more maintainable way.)*

1.  **Phase 1: Core Encounter Form (In Progress)**
    -   [x] Rebuild the main encounter form using Angular's Reactive Forms (`FormBuilder`).
    -   [x] Handle basic create and edit modes.
    -   [x] Implement basic client-side validation for date, time, and duration.
    -   [ ] Add student selection.
    -   [ ] Add student list display.

2.  **Phase 2: Student Management**
    -   Implement student search and selection.
    -   Implement adding/removing students from the encounter state.
    -   Display the list of selected students.

3.  **Phase 3: Advanced Validation & Saving**
    -   Integrate server-side validation logic.
    -   Re-evaluate the need for the complex client-side validation chains. Simplify where possible, relying on the backend for business rule enforcement.

4.  **Phase 4: E-Signature**
    -   Design and implement the new e-signature workflow.

5.  **Refactoring Opportunities:**
    -   **State Management:** Introduce a local state management solution or a component-level service to manage the form's state, reducing the number of class properties.
    -   **Data Loading:** Use route resolvers or dedicated services to load data, decoupling the component from data fetching logic.
    -   **Component Decomposition:** Break down the monolithic component into smaller, more focused child components (e.g., `StudentSelectorComponent`, `StudentListComponent`, `EncounterActionsComponent`).

---
## Proposed UI/UX Enhancements

To create a user experience that is modern, intuitive, and efficient, we will leverage Angular Material components and follow established design patterns. The goal is to move away from the cluttered, multi-panel layout of the legacy version to a clean, guided workflow.

### 1. A Unified UI for All Service Types
A key strategic improvement will be the use of this single form to handle the creation and editing of all related service types: Encounters, Evaluations, and Non-MSP (Other Non-Billable) services. This simplifies the codebase and provides a consistent user experience. This decision is informed by reviewing both `encounter-basic-info.component.ts` and `evaluation-detail.component.ts`, which revealed they are functionally similar.

-   **Dynamic Form Fields:** The form will dynamically adapt based on the selection in the `Service Type` dropdown.
    -   If a user selects `"Evaluation/Assessment"`, an `Evaluation Type` and a `Reason for Service` dropdown will appear, becoming required fields.
    -   If a user selects `"Other Non-Billable"`, a `Non-MSP Service` dropdown will appear, also required.
    -   For a standard `"Treatment/Therapy"` encounter, no extra fields will be shown.
-   **Implementation:** This will be managed with straightforward `*ngIf` directives in the component template, reacting to the value of the `serviceTypeId` form control.
-   **Routing:** The application's routing will be configured to support distinct entry points (e.g., a "New Evaluation" button in the main navigation). These routes will all lead to this single form component, passing a `serviceTypeId` in the query parameters to pre-populate the form into the correct state.

### 2. Overall Layout: A Card-Based Approach

Instead of the disconnected panels, we will use a single-column, responsive layout structured with **Angular Material Cards (`<mat-card>`)**. Each card will group a logical section of the form, creating a clear visual hierarchy.

-   **Card 1: Encounter Details:** Contains the core information like Service Type, Date, and Time, along with any dynamically displayed fields (e.g., Evaluation Type).
-   **Card 2: Sessions:** Manages the selection and display of students in the encounter.
-   **Card 3: Session Notes & Details:** A unified area for capturing notes and other details relevant to the session.

### 3. Form Controls: Modern and Intuitive

We will replace the legacy form inputs with their Angular Material counterparts for a consistent look and feel and improved usability.

-   **Date and Time:** Use the **Material Datepicker (`<mat-datepicker>`)** for the encounter date. Standard `time` inputs, styled to match the Material theme, will be used for start and end times, providing a native and familiar experience on all devices.
-   **Dropdowns:** All dropdowns (e.g., Service Type, Location) will be replaced with **`mat-select`**, which offers better styling, filtering, and accessibility.

### 4. Student Management: Autocomplete and Chips

The student selection process will be completely redesigned for efficiency, especially for providers with large caseloads.

-   **Search & Select:** The core of the new student selection will be an **Angular Material Autocomplete (`<mat-autocomplete>`)** form field. As the provider types a student's name, a list of matching students will appear, from which they can make a selection. This is a common pattern users will be familiar with from apps like Gmail or Outlook.
-   **Student Filtering:** To improve searchability, we will include a `mat-select` dropdown above the autocomplete input to allow providers to filter students by their **School District**. This is a key feature inherited from the legacy evaluation form.
-   **Visual Feedback:** Selected students will be displayed as **Material Chips (`<mat-chip-list>`)** directly below the search input. This provides immediate, clear feedback on who has been added to the encounter. Each chip will have a "remove" icon, making it easy to correct mistakes.
-   **Auxiliary Actions:** Buttons for "Switch to All Students" or "Add New Student" will be clearly placed near the autocomplete input. The "Add New Student" action should open a **Material Dialog (`mat-dialog`)**, allowing the user to complete the task without losing the context of the encounter form they are filling out.

### 5. Session Details: An Expandable Table with Detail Components

Deeper analysis of the legacy `encounter-student.component` and its sub-components (`encounter-student-goals`, etc.) reveals that the per-student data entry is a highly complex and stateful process. The per-student details cannot be managed by simple form controls in an expanded row.

Therefore, the expanded detail section will serve as a container for smaller, dedicated components and launch points for more complex editing workflows.

-   **Layout:** The expandable table remains the core concept.
-   **Summary Row Columns (Collapsed View):** Student Name, Status, Deviation Reason, and an Expand/Collapse icon.
-   **Detail Section (Expanded View):**
    -   This section will contain a series of "display" components that show the currently selected data (e.g., a list of selected goals, a list of selected CPT codes).
    -   Next to each display, there will be a **`[+ Manage ...]` button** (e.g., `[+ Manage Goals]`).
-   **Full-Screen Dialog for Management:**
    -   Clicking a "Manage" button will open a **full-screen Material Dialog**. This dialog will house a new, dedicated component for that specific task (e.g., `GoalManagerComponent`).
    -   **Example `GoalManagerComponent` Workflow:**
        -   The dialog will use a two-panel layout.
        -   **Left Panel:** Shows a list of all *available* goals for the student.
        -   **Right Panel:** Shows the goals that have been *added* to the encounter. Each goal in this list will have its own set of controls beneath it to capture outcome data (e.g., a "Service Outcome" dropdown, notes).
-   **Component-Based Architecture:** This pattern will be repeated for Goals, CPT Codes, and Methods. Each will have its own "manager" component that lives inside a dialog, ensuring the main encounter form remains clean and the complex editing tasks are handled in a focused, dedicated UI.

### 6. Primary Actions: A Sticky Footer

To ensure the main actions are always accessible, we will implement a sticky footer bar.

-   **Visibility:** This action bar will remain fixed to the bottom of the screen, so the user never has to scroll to find the "Save" or "Cancel" buttons.
-   **Actions:** It will contain the primary buttons for the form, such as `Save Draft`, `Submit & E-Sign`, and `Cancel`. This follows a common pattern seen in many modern web applications. 