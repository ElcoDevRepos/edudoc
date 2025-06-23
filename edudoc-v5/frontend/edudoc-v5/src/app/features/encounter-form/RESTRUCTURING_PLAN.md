# Encounter Form Component Restructuring Plan

## Current State Assessment

### ✅ Completed Refactoring
- **Clean model structure**: Extracted `Session` and `SelectOption` interfaces
- **Validators separated**: Moved to dedicated files with comprehensive tests
- **Consistent terminology**: Systematically updated from "participant" to "session" throughout codebase
- **Shared models**: `SelectOption` available for reuse across application

### ❌ Remaining Issues
- **Monolithic component**: 416 lines in single component file
- **Mixed responsibilities**: Data management, UI logic, business rules, and state all in one place
- **Hard to test**: Tightly coupled dependencies
- **Hard to maintain**: Changes require understanding entire component
- **Not reusable**: Business logic tied to specific component

---

## Restructuring Strategy

### Goal: Transform 416-line monolith into maintainable, testable architecture

**Target Structure:**
- Main component: ~120 lines (orchestration only)
- Child components: 50-100 lines each (focused responsibilities)
- Services: 80-120 lines each (single responsibility)

---

## Phase 1: Extract Data Services
**Priority: HIGH** | **Impact: ~100 lines removed**

### Create Service Layer
```
/services/
  ├── encounter-form-data.service.ts    # Mock data + future API integration  
  ├── session-management.service.ts     # Session CRUD operations
  └── form-validation.service.ts        # Business rule validation
```

### encounter-form-data.service.ts
**Responsibilities:**
- All mock data arrays (`serviceTypes`, `evaluationTypes`, `districts`, etc.)
- API integration points for future development
- Data transformation logic
- Lookup data management

**Methods to Extract:**
- Mock data properties (50+ lines)
- `mockLoadEncounter()` functionality
- Data loading coordination

### session-management.service.ts
**Responsibilities:**
- Session CRUD operations
- Student search and filtering
- Session state management
- Validation of session constraints

**Methods to Extract:**
- `onStudentSelected()`
- `addSession()`
- `removeSession()`
- Session validation logic

### form-validation.service.ts
**Responsibilities:**
- Business rule validation
- Cross-field validation
- Error message generation
- Validation state management

**Methods to Extract:**
- Complex validation chains
- Business rule enforcement
- Error handling logic

---

## Phase 2: Create Form Utilities
**Priority: MEDIUM** | **Impact: ~60 lines removed**

### Create Utility Layer
```
/utils/
  ├── form-builder.util.ts             # Dynamic form creation logic
  └── encounter-form.constants.ts      # Form configurations & defaults
```

### form-builder.util.ts
**Responsibilities:**
- Dynamic form creation based on service type
- Form group generation
- Field configuration management
- Validation rule application

**Methods to Extract:**
- `setupForm()` complexity
- `createSessionFormGroup()` logic
- Dynamic form control management

### encounter-form.constants.ts
**Responsibilities:**
- Form field configurations
- Default values
- Validation rules
- Service type mappings

**Contains:**
- Form configurations
- Default values
- Dropdown options
- Validation constraints

---

## Phase 3: Break Down UI Components
**Priority: HIGH** | **Impact: ~150 lines removed**

### Create Component Hierarchy
```
/components/
  └── encounter-form-page/
      ├── encounter-form-page.component.ts        # Main orchestrator (~120 lines)
      └── sub-components/
          ├── encounter-details-card/             # Card 1: Service details
          ├── session-management-card/            # Card 2: Session selection & table  
          └── session-detail-panel/               # Expandable session details
```

### encounter-details-card.component.ts
**Responsibilities:**
- Service type selection
- Date/time inputs
- Dynamic fields (evaluation type, reason for service)
- Form validation display

**Input/Output:**
```typescript
@Input() formGroup: FormGroup;
@Input() serviceTypes: SelectOption[];
@Input() evaluationTypes: SelectOption[];
@Output() serviceTypeChange = new EventEmitter<ServiceTypeId>();
```

### session-management-card.component.ts
**Responsibilities:**
- Student search and autocomplete
- Session table display
- Add/remove session actions
- District filtering

**Input/Output:**
```typescript
@Input() sessions: Session[];
@Input() districts: SelectOption[];
@Input() isEvaluation: boolean;
@Output() sessionSelected = new EventEmitter<SelectOption>();
@Output() sessionRemoved = new EventEmitter<Session>();
@Output() sessionAdded = new EventEmitter<void>();
```

### session-detail-panel.component.ts
**Responsibilities:**
- Expandable session details
- Status management
- Time controls
- Goal/CPT/Method management integration
- Case notes

**Input/Output:**
```typescript
@Input() session: Session;
@Input() isExpanded: boolean;
@Input() deviationReasons: SelectOption[];
@Output() statusChange = new EventEmitter<boolean>();
@Output() expansionChange = new EventEmitter<boolean>();
@Output() goalsManage = new EventEmitter<Session>();
```

### Refactored Main Component
```typescript
export class EncounterFormPageComponent implements OnInit {
  encounterForm$ = this.dataService.form$;
  sessions$ = this.sessionService.sessions$;
  serviceTypes$ = this.dataService.serviceTypes$;
  
  constructor(
    private dataService: EncounterFormDataService,
    private sessionService: SessionManagementService,
    private validationService: FormValidationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Route parameter handling
    // Service initialization
  }

  onSubmit(): void {
    // High-level submit coordination
  }
  
  onCancel(): void {
    // Navigation handling
  }
}
```

---

## Phase 4: State Management Service
**Priority: MEDIUM** | **Impact: ~40 lines removed**

### Create State Service
```
/services/
  └── encounter-form-state.service.ts   # Centralized state management
```

### encounter-form-state.service.ts
**Responsibilities:**
- Form state management
- Session expansion state
- Loading states
- Error state management
- UI state coordination

**State Properties:**
- `expandedSession$: Observable<Session | null>`
- `loading$: Observable<boolean>`
- `errors$: Observable<ValidationErrors[]>`
- `formDirty$: Observable<boolean>`

**Methods:**
- `setExpandedSession(session: Session | null)`
- `setLoading(loading: boolean)`
- `addError(error: ValidationError)`
- `clearErrors()`

---

## Phase 5: Dialog & UI Services
**Priority: LOW** | **Impact: ~30 lines removed**

### Create Dialog Service
```
/services/  
  └── encounter-dialogs.service.ts      # Goal manager + other dialogs
```

### encounter-dialogs.service.ts
**Responsibilities:**
- Dialog management
- Goal manager integration
- Future dialog workflows
- Dialog state coordination

**Methods to Extract:**
- `openGoalsManager()`
- Dialog configuration logic
- Result handling

---

## Implementation Strategy

### Step-by-Step Approach

1. **Phase 1a**: Create `EncounterFormDataService` and move mock data
2. **Phase 1b**: Create `SessionManagementService` and move session logic
3. **Phase 1c**: Create `FormValidationService` and move validation logic
4. **Phase 3a**: Extract `EncounterDetailsCardComponent`
5. **Phase 3b**: Extract `SessionManagementCardComponent`
6. **Phase 3c**: Extract `SessionDetailPanelComponent`
7. **Phase 2**: Create form utilities and constants
8. **Phase 4**: Implement state management service
9. **Phase 5**: Extract dialog service

### Testing Strategy

Each extracted service and component should have:
- **Unit tests**: Isolated testing of business logic
- **Integration tests**: Testing service interactions
- **Component tests**: Testing UI behavior
- **E2E tests**: Testing complete user workflows

### Migration Benefits

#### Immediate Benefits (Phase 1)
- ✅ Cleaner component with separated concerns
- ✅ Testable business logic in services
- ✅ Reusable data services for other components

#### Medium-term Benefits (Phases 2-3)
- ✅ Modular UI components
- ✅ Easier feature development
- ✅ Better error handling and validation

#### Long-term Benefits (Phases 4-5)
- ✅ Centralized state management
- ✅ Consistent user experience
- ✅ Scalable architecture for new features

---

## Success Metrics

### Code Quality
- **Main component**: <150 lines
- **Service methods**: <50 lines each
- **Component methods**: <30 lines each
- **Test coverage**: >90% for services, >80% for components

### Maintainability
- **Single responsibility**: Each file has one clear purpose
- **Low coupling**: Components depend on interfaces, not implementations
- **High cohesion**: Related functionality grouped together

### Developer Experience
- **Faster feature development**: New functionality easier to add
- **Easier debugging**: Clear separation of concerns
- **Better testing**: Isolated units easier to test
- **Documentation**: Clear component hierarchy and responsibilities

---

## Next Steps

**Recommended Starting Point: Phase 1a - Extract Data Service**

This provides immediate value with minimal risk:
1. Create `EncounterFormDataService`
2. Move mock data arrays
3. Update component to inject service
4. Add basic tests

**Expected outcome**: ~50 line reduction in main component, cleaner separation of data and UI logic.

Ready to begin implementation? 🚀 