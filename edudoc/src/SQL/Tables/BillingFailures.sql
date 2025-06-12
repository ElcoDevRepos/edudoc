CREATE TABLE [dbo].[BillingFailures]
(
	[Id] INT NOT NULL IDENTITY, 
    [EncounterStudentId] INT NOT NULL,
    [BillingFailureReasonId] INT NOT NULL,
    [BillingScheduleId] INT NULL,
    [DateOfFailure]  DATETIME NOT NULL DEFAULT (getdate()),
    [IssueResolved] BIT NOT NULL DEFAULT 0,
    [DateResolved]  DATETIME NULL,
    [ResolvedById] INT NULL,
    CONSTRAINT [FK_BillingFailures_EncounterStudent] FOREIGN KEY ([EncounterStudentId]) REFERENCES EncounterStudents(Id),
    CONSTRAINT [FK_BillingFailures_BillingFailureReason] FOREIGN KEY ([BillingFailureReasonId]) REFERENCES BillingFailureReasons(Id),
    CONSTRAINT [FK_BillingFailures_BillingSchedule] FOREIGN KEY ([BillingScheduleId]) REFERENCES BillingSchedules(Id),
    CONSTRAINT [FK_BillingFailures_ResolvedBy] FOREIGN KEY ([ResolvedById]) REFERENCES Users(Id),
    CONSTRAINT [PK_BillingFailures] PRIMARY KEY ([Id]) 
)
