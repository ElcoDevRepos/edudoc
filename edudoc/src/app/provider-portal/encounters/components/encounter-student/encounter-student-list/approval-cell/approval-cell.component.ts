import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { ElectronicSignatures } from '@model/enums/electronic-signatures.enum';
import { EncounterStatuses } from '@model/enums/encounter-status.enum';
import { IESignatureContent } from '@model/interfaces/e-signature-content';
import { IEncounterStudent } from '@model/interfaces/encounter-student';
import { AuthService } from '@mt-ng2/auth-module';
import { IEntity } from '@mt-ng2/base-service';
import { IEntityListComponentMembers, IEntityListDynamicCellComponent } from '@mt-ng2/entity-list-module';
import { IModalOptions } from '@mt-ng2/modal-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ElectronicSignatureModalService } from '@provider/common/electronic-signature-modal/electronic-signature-modal.service';
import { SupervisorApprovalModalService } from '@provider/common/supervisor-approval-modal/supervisor-approval-modal.service';
import { EncounterStudentService } from '@provider/encounters/services/encounter-student.service';
import { ProviderElectronicSignaturesService } from '@provider/encounters/services/provider-electronic-signature. service';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
    styles: [],
    templateUrl: './approval-cell.component.html',
})
export class EncounterApprovalCellDynamicCellComponent implements IEntityListDynamicCellComponent, OnDestroy {
    entityListComponentMembers: IEntityListComponentMembers;
    set entity(value: IEntity) {
        this.encounterStudent = value as IEncounterStudent;
    }

    encounterStudent: IEncounterStudent;

    modalOptions: IModalOptions = {
        customClass: {
            title: 'text-center',
        },
        showCloseButton: true,
        showConfirmButton: false,
        width: '50%',
    };
    encounterIdForModal: number;
    doubleClickDisabled = false;

    subscriptions: Subscription;
    signature: IESignatureContent;

    constructor(
        private notificationsService: NotificationsService,
        private encounterStudentService: EncounterStudentService,
        private electronicSignatureModalService: ElectronicSignatureModalService,
        private supervisorApprovalModalService: SupervisorApprovalModalService,
        private electronicSignatureService: ProviderElectronicSignaturesService,
        private cdr: ChangeDetectorRef,
        private authService: AuthService,
    ) {
        this.subscriptions = new Subscription();
    }

    get encounterNeedsSignature(): boolean {
        return this.encounterStudent.SupervisorESignedById && !this.encounterStudent.SupervisorDateESigned;
    }

    ngOnInit(): void {
        this.electronicSignatureService.getById(ElectronicSignatures.Encounter).subscribe((signature) => {
            this.signature = signature;
        });
    }

    signEncounter(event: Event): void {
        event.stopPropagation();
        this.showSignModal();
    }

    rejectEncounter(event: Event): void {
        event.stopPropagation();
        this.showRejectionModal();
    }

    showSignModal(): void {
        const loggedInProviderName = this.authService.currentUser.getValue().Name;
        const mergeFields = [{ target: '(Merged Provider Name)', value: loggedInProviderName }];
        this.electronicSignatureModalService.showModal(this.signature, mergeFields);
        this.subscriptions.add(
            this.electronicSignatureModalService.saved.subscribe(() => {
                this.encounterStudent.SupervisorDateESigned = new Date();
                this.encounterStudent.SupervisorESignatureText = this.signature.Content;
                this.encounterStudent.SupervisorESignedById = this.authService.currentUser.getValue().Id;
                this.encounterStudent.EncounterStatusId = EncounterStatuses.E_Signed;
                const eSignPatch = {
                    AssistantSigning: false,
                    EncounterStatusId: this.encounterStudent.EncounterStatusId,
                    SupervisorDateESigned: this.encounterStudent.SupervisorDateESigned,
                    SupervisorESignatureText: this.encounterStudent.SupervisorESignatureText,
                    SupervisorESignedById: this.encounterStudent.SupervisorESignedById,
                };
                this.encounterStudentService
                    .signEncounter(this.encounterStudent.Id, eSignPatch)
                    .pipe(
                        finalize(() => {
                            this.subscriptions.unsubscribe();
                            this.subscriptions.closed = false;
                        }),
                    )
                    .subscribe((result) => {
                        // Sometimes the status changes on the backend, for example if an assistant was signing
                        this.encounterStudent.EncounterStatusId = result.EncounterStatusId;
                        this.notificationsService.success('Encounter signed successfully.');
                        this.encounterStudentService.emitChange(this.encounterStudent);
                    });
            }),
        );
    }

    showRejectionModal(): void {
        this.supervisorApprovalModalService.showModal();
        this.subscriptions.add(
            this.supervisorApprovalModalService.rejected.subscribe((comments) => {
                const eSignRejectionPatch = {
                    EncounterStatusId: EncounterStatuses.Returned_By_Supervisor,
                    SupervisorComments: comments,
                    SupervisorESignedById: null,
                };
                this.encounterStudentService
                    .rejectEncounter(this.encounterStudent.Id, eSignRejectionPatch)
                    .pipe(
                        finalize(() => {
                            this.subscriptions.unsubscribe();
                            this.subscriptions.closed = false;
                        }),
                    )
                    .subscribe(() => {
                        this.notificationsService.success('Encounter rejected successfully.');
                        this.encounterStudentService.emitChange(this.encounterStudent);
                    });
            }),
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        this.cdr.detach();
    }
}
