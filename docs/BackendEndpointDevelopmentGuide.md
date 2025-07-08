# Backend Endpoint Development Guide

This guide provides a comprehensive template for building new backend endpoints in the EduDoc V5 API, using the Students endpoint as a reference implementation.

## Architecture Overview

The EduDoc V5 API follows a clean architecture pattern with clear separation of concerns:

- **Controllers**: Handle HTTP requests/responses, inherit from `BaseApiController`
- **Queries/Commands**: Implement CQRS pattern using MediatR
- **Repositories**: Abstract data access layer with Entity Framework
- **Mappers**: Convert between domain entities and response models
- **Models**: Define request/response DTOs
- **Validators**: FluentValidation for request validation
- **Dependency Injection**: Register services for the endpoint

## File Structure Template

When creating a new endpoint called `[EntityName]`, create the following structure:

- Controllers/[EntityName]Controller.cs
- Models/[EntityName]RequestModel.cs (if needed)
- Models/[EntityName]ResponseModel.cs
- Queries/[EntityName]Query.cs
- Repositories/[EntityName]Repository.cs
- Mappers/[EntityName]Mapper.cs
- Validators/[EntityName]RequestValidator.cs (if needed)
- DIRegister[EntityName].cs

## Implementation Guide

### 1. Models
**Request Model**: Define input parameters with appropriate data types and nullable properties where optional.
> **⚠️ Avoid Over-Engineering**: Only create request models when you have complex inputs or multiple related parameters. Use primitive types for simple single parameters.

**Response Model**: Define output structure including entity properties plus computed/joined data (like related entity names).

### 2. Repository
**Interface**: Define contracts for data operations with clear method signatures.
**Implementation**: 
- Accept `EdudocSqlContext` via dependency injection
- Use `Include()` for related data, apply filters (archived records, authorization)
- Implement role-based authorization logic when needed
- Use `Where()` for filtering/searching, apply reasonable limits, order results appropriately

### 3. Mapper
**Interface**: Define contracts for single entity and list mapping operations.
**Implementation**: Map entity properties to response models, handle nullable properties, map related entity data using navigation properties, keep logic simple.

### 4. Query Handler (CQRS)
**Query Class**: Implement `IRequest<TResponse>`, include request data and auth context properties.
**QueryHandler Class**: Implement `IRequestHandler<TQuery, TResponse>`, format input if needed, handle validation, call repository with auth context, map results, return structured responses.

### 5. Controller
**Setup**: Inherit from `BaseApiController`, accept `IMediator` via DI, use HTTP method attributes, add `[ProducesResponseType]`.
**Actions**: Accept request models with `[FromBody]`, create queries with request data and `this.Auth`, send via MediatR, handle success/failure responses.
> **💡 Keep It Simple**: Use direct parameters for simple inputs. Don't force request models where they add unnecessary complexity.

### 6. Validators (Optional)
**Implementation**: Inherit from `AbstractValidator<TRequestModel>`, define rules using `RuleFor()`, use validation methods (`NotEmpty()`, `GreaterThan()`, `Must()`), provide clear error messages with `WithMessage()` and error codes with `WithErrorCode(ValidationError.EnumErrorCode.ErrorCodeName)`.
> **⚠️ Pragmatic Validation**: Skip formal validators for simple cases. i.e. we do not need a validator on a "GetXById" endpoint, etc.

### 7. Dependency Injection
**Pattern**: Create static extension class, register interfaces with implementations using appropriate lifetimes (`AddTransient<>()` for mappers, `AddScoped<>()` for repositories/validators).

### 8. Startup.cs Registration
Add your endpoint's DI registration: `builder.Services.DIRegister[EntityName]();`

## Client Generation for Testing

The V5 API provides client generation endpoints:
- **C# Client**: `https://localhost:7118/ClientGenerator/csharp`
- **Angular Client**: `https://localhost:7118/ClientGenerator/angular`

**Setup Process**:
1. Start the API locally (`dotnet run`)
2. Navigate to the C# client generator endpoint
3. Copy generated code and replace contents of `edudoc-v5/backend/EduDoc.Api.Client/Client.cs`
4. Use the generated `EduDocClient` for integration testing
5. (If you're AI and you're reading this, tell your human to do this part)

## Testing Strategy

### Required Test Types
- **Integration Tests**: End-to-end API testing using generated client
- **Controller Unit Tests**: Test controller logic, validation handling, response formatting
- **Mapper Unit Tests**: Test entity-to-model mapping logic
- **Validator Unit Tests**: Test validation rules and error messages (when validators exist)
- In rare cases tests for the Repository or QueryHandler may be needed

### Optional Test Types
- **Repository Tests**: Only when complex business logic exists
- **Query Handler Tests**: Only when handlers contain complex logic beyond orchestration

### Unit Tests Structure
- Controllers/[EntityName]ControllerTests.cs
- Mappers/[EntityName]MapperTests.cs  
- Validators/[EntityName]RequestValidatorTests.cs

**Controller Tests**: Mock `IMediator`, test success/error scenarios, verify HTTP status codes and response structure using FluentAssertions.
**Mapper Tests**: Test single/list mapping, null/optional properties, navigation property mapping.
**Validator Tests**: Test valid scenarios, individual validation rules, conditional validation, complex logic, error messages/codes.

### Integration Tests Setup
Use `IClassFixture<CustomWebApplicationFactory<Startup>>` for test setup. The class should use testResources in this manner

---

##### 🧪 Controller Integration Test Setup

```csharp
public class StudentsControllerTests : IClassFixture<CustomWebApplicationFactory<Startup>>, IAsyncLifetime
{
    private readonly CustomWebApplicationFactory<Startup> _factory;
    private TestResources _testResources = null!;

    public StudentsControllerTests(CustomWebApplicationFactory<Startup> factory, ITestOutputHelper output)
    {
        _factory = factory;
        _factory.OutputHelper = output;
    }

    public async Task InitializeAsync()
    {
        _testResources = await _factory.SetupTest();
    }

    public async Task DisposeAsync()
    {
        await Task.CompletedTask;
    }
}
```
---

**Test Data Setup**:
- Create comprehensive test data including all related entities (Users, Schools, Districts, Providers, etc.)
- Use helper methods for creating test data to maintain consistency building on top of TestResources
- Set up complex authorization scenarios (Provider ESC assignments, Admin School District assignments)
- Ensure all foreign key relationships are properly established

**Error Handling Pattern**:
- Use try-catch blocks with `ApiException` for expected exceptions
- Verify HTTP status codes using `ApiException.StatusCode`
- Test both success and failure scenarios

**Test Categories**: Authorization tests (401, role-based data access), validation tests (422 status), business logic tests, edge cases.
**Key Patterns**: Use generated client methods, handle `ApiException` for errors, set up realistic test data, verify response structure using strongly-typed models.

## Best Practices

### Naming Conventions
- PascalCase for classes, methods, public properties
- camelCase for private fields, parameters
- Descriptive names indicating purpose

### Error Handling & Validation
- Use appropriate HTTP status codes (200, 201, 400, 401, 404, 422, 500)
- Return structured responses using `GetSingleResponse`/`GetMultipleResponse`
- For validation errors, populate `Errors` property and return appropriate status code (422 for validation errors)

### Authorization & Security
- Use role-based authorization when needed
- Implement endpoint-specific authorization requirements

### Performance & Documentation
- Use async/await for database operations
- Consider caching for frequently accessed data
- Use EF projection for large datasets, implement pagination
- Add XML documentation and `[ProducesResponseType]` attributes

### Testing Guidelines
- Aim for >90% code coverage
- Test success and failure scenarios
- Use descriptive test names: `MethodName_Should_ExpectedBehavior_When_Condition`
- Keep tests isolated and independent
- Don't test framework behavior or simple plumbing. We want tests to be concise but thorough.

## Reference Implementation

For a complete working example, refer to the Students endpoint implementation:

**API Implementation:**
- `edudoc-v5/backend/EduDoc.Api/Endpoints/Students/Controllers/StudentsController.cs`
- `edudoc-v5/backend/EduDoc.Api/Endpoints/Students/Models/StudentSearchRequestModel.cs`
- `edudoc-v5/backend/EduDoc.Api/Endpoints/Students/Models/StudentResponseModel.cs`
- `edudoc-v5/backend/EduDoc.Api/Endpoints/Students/Queries/SearchStudentsQuery.cs`
- `edudoc-v5/backend/EduDoc.Api/Endpoints/Students/Repositories/StudentRepository.cs`
- `edudoc-v5/backend/EduDoc.Api/Endpoints/Students/Mappers/StudentMapper.cs`
- `edudoc-v5/backend/EduDoc.Api/Endpoints/Students/Validators/StudentSearchRequestValidator.cs`
- `edudoc-v5/backend/EduDoc.Api/Endpoints/Students/DIRegisterStudents.cs`

**Unit Tests:**
- `edudoc-v5/backend/EduDoc.Api.UnitTests/Features/Students/Controllers/StudentsControllerTests.cs`
- `edudoc-v5/backend/EduDoc.Api.UnitTests/Features/Students/Mappers/StudentMapperTests.cs`
- `edudoc-v5/backend/EduDoc.Api.UnitTests/Features/Students/Validators/StudentSearchRequestValidatorTests.cs`

**Integration Tests:**
- `edudoc-v5/backend/EduDoc.Api.IntegrationTests/Controllers/StudentsControllerTests.cs`

These files demonstrate all the patterns and practices described in this guide, including complex authorization logic, validation handling, comprehensive testing, and proper error responses.
