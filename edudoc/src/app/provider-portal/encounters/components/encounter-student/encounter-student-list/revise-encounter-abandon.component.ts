import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { abandonendNotesField } from '@common/controls/abandoned-notes-field';
import { EncounterStatuses } from '@model/enums/encounter-status.enum';
import { IClaimAuditRequestDto } from '@model/interfaces/custom/claim-audit-request.dto';
import { IEncounterStudent } from '@model/interfaces/encounter-student';
import { DynamicField } from '@mt-ng2/dynamic-form';
import { IEntityListComponentMembers, IEntityListDynamicCellComponentGeneric } from '@mt-ng2/entity-list-module';
import { IModalOptions } from '@mt-ng2/modal-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { EncounterService } from '@provider/encounters/services/encounter.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-revise-encounter-abandon',
    styles: [
        `
            .disabled-icon {
                cursor: not-allowed;
                opacity: 0.5;
                pointer-events: none;
            }
        `,
    ],
    templateUrl: './revise-encounter-abandon.component.html',
})
export class ReviseEncounterAbandonComponent implements IEntityListDynamicCellComponentGeneric<IEncounterStudent>, OnInit, OnDestroy {
    entity: IEncounterStudent;
    entityListComponentMembers: IEntityListComponentMembers;
    showAbandonedNotesModal = false;
    modalOptions: IModalOptions = {
        customClass: {
            title: 'text-center',
        },
        showCloseButton: true,
        showConfirmButton: false,
        width: '50%',
    };
    EncounterStatuses = EncounterStatuses;
    abandonedNotesField: DynamicField = abandonendNotesField;
    abandonedNotesValue = this.abandonedNotesField.value;
    reasonForAbandonmentControl: AbstractControl;
    encounterService: EncounterService;
    notificationService: NotificationsService;
    cdr: ChangeDetectorRef;
    isDisabled: boolean;
    private readonly destroy$ = new Subject<void>();

    constructor() {
        this.encounterService = inject(EncounterService);
        this.cdr = inject(ChangeDetectorRef);
        this.notificationService = inject(NotificationsService);
    }

    ngOnInit(): void {
        const disabledStatuses = [EncounterStatuses.Abandoned, EncounterStatuses.Invoiced, EncounterStatuses.Invoiced_and_Paid];
        this.isDisabled = disabledStatuses.includes(this.entity.EncounterStatusId);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onAbandonClick(event: Event): void {
        if (this.isDisabled) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        this.showAbandonedNotesModal = true;
    }

    updateEncounterStatus(): void {
        const request: IClaimAuditRequestDto = {
            EncounterStudentId: this.entity.Id,
            ReasonForAbandonment: this.reasonForAbandonmentControl ? this.reasonForAbandonmentControl.value : null,
            ReasonForReturn: null,
            StatusId: EncounterStatuses.Abandoned,
        };
        this.encounterService
            .updateStatus(request)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.showAbandonedNotesModal = false;
                    this.isDisabled = true;
                    this.notificationService.success('Encounter abandoned successfully');
                    this.cdr.detectChanges();
                    this.encounterService.emitEncounterAbandonedChange();
                },
                error: () => {
                    // Handle the error here
                    this.notificationService.error('Failed to abandon encounter');
                },
            });
    }
}
