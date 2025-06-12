import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { DateTimeConverterService } from '@common/services/date-time-converter.service';
import { EncounterServiceTypes } from '@model/enums/encounter-service-types.enum';
import { IEncounterStudent } from '@model/interfaces/encounter-student';
import { IEncounterStudentCptCode } from '@model/interfaces/encounter-student-cpt-code';
import { IEntity } from '@mt-ng2/base-service';
import { IEntityListComponentMembers, IEntityListDynamicCellComponent } from '@mt-ng2/entity-list-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { EncounterStudentCptCodesService } from '@provider/encounters/services/encounter-student-cpt-codes.service';
import { ProviderPortalAuthService } from '@provider/provider-portal-auth.service';

@Component({
    styles: [],
    templateUrl: './evaluation-cpt-code-cell.component.html',
})
export class EvaluationCptCodeCellComponent implements IEntityListDynamicCellComponent, OnInit, OnDestroy {
    entityListComponentMembers: IEntityListComponentMembers;
    set entity(value: IEntity) {
        this.encounterStudent = value as IEncounterStudent;
    }

    get encounterStudentCptCodes(): IEncounterStudentCptCode[] {
        return this.encounterStudent.EncounterStudentCptCodes.filter((cc) => !cc.Archived);
    }

    get selectedCptCodeOptions(): MtSearchFilterItem[] {
        return this.cptCodeOptions.filter((cc) => cc.Selected);
    }

    get cptCodes(): string {
        return this.encounterStudentCptCodes.map((cc) => cc.CptCode.Code).join(', ');
    }

    isEditing = false;
    encounterStudent: IEncounterStudent;
    cptCodeOptions: MtSearchFilterItem[] = [];

    constructor(
        private notificationsService: NotificationsService,
        private cptCodeService: EncounterStudentCptCodesService,
        private cdr: ChangeDetectorRef,
        private dateTimeConverter: DateTimeConverterService,
        private providerPortalAuthService: ProviderPortalAuthService,
    ) {}

    ngOnInit(): void {
        this.cptCodeService
            .getCptCodeOptions(
                EncounterServiceTypes.Evaluation_Assessment,
                this.encounterStudent.CaseLoad?.ServiceCodeId ?? this.providerPortalAuthService.getProviderServiceCode(),
            )
            .subscribe((cptCodes) => {
                this.cptCodeOptions = cptCodes.map(
                    (item) =>
                        new MtSearchFilterItem(
                            {
                                ...item,
                                Name: `${item.Code} - ${item.Description}`,
                            },
                            this.encounterStudentCptCodes.some((cc) => cc.CptCodeId === item.Id),
                        ),
                );

                // Enable editing by default if no codes are selected
                if (this.selectedCptCodeOptions.length === 0) {
                    this.isEditing = true;
                    this.cdr.detectChanges();
                }
            });
    }

    ngOnDestroy(): void {
        this.cdr.detach();
    }

    edit(event: Event): void {
        event.stopPropagation();
        this.isEditing = !this.isEditing;
    }

    save(event: Event): void {
        event.stopPropagation();
        this.isEditing = !this.isEditing;

        this.cptCodeService
            .bulkUpdate(
                this.encounterStudent.Id,
                this.selectedCptCodeOptions.map((cc) => cc.Item.Id),
                this.dateTimeConverter.getTimeDurationInMins(this.encounterStudent.EncounterStartTime, this.encounterStudent.EncounterEndTime),
            )
            .subscribe((res) => {
                this.encounterStudent.EncounterStudentCptCodes = res;
                this.cdr.detectChanges();
                this.success();
            });
    }

    success(): void {
        this.notificationsService.success('CPT codes successfully updated');
    }
}
