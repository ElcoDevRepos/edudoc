import { ServiceUnitRuleService } from '@admin/service-unit-rules/services/service-unit-rule.service';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';
import { unarchiveConfirm } from '@common/mtConfirmOptions/mtConfirmOptions';
import { IServiceUnitRule } from '@model/interfaces/service-unit-rule';
import { IEntity } from '@mt-ng2/base-service';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType, InputTypes, LabelPositions } from '@mt-ng2/dynamic-form';
import { IEntityListComponentMembers, IEntityListDynamicCellComponent } from '@mt-ng2/entity-list-module';
import { IModalOptions } from '@mt-ng2/modal-module';
import { NotificationsService } from '@mt-ng2/notifications-module';

@Component({
    styles: [],
    templateUrl: './effective-till-cell.component.html',
})
export class EffectiveTillCellDynamicCellComponent implements IEntityListDynamicCellComponent, OnDestroy {
    entityListComponentMembers: IEntityListComponentMembers;
    set entity(value: IEntity) {
        this.serviceUnitRule = value as IServiceUnitRule;
    }

    modalOptions: IModalOptions = {
        showCancelButton: false,
        showConfirmButton: false,
        width: '50%',
    };

    serviceUnitRule: IServiceUnitRule;

    showModal = false;
    _unarchiveConfirm = unarchiveConfirm;

    effectiveDateControl: AbstractControl;

    constructor(
        private notificationsService: NotificationsService,
        private cdr: ChangeDetectorRef,
        private serviceUnitRuleService: ServiceUnitRuleService,
    ) {
    }

     

    get ruleIsArchived(): boolean {
        return this.serviceUnitRule.Archived;
    }

    archiveRule(event: Event): void {
        event.stopPropagation();
        this.toggleModal();
    }

    toggleModal(): void {
        this.showModal = !this.showModal;
        this.cdr.detectChanges();
    }

    getEffectiveDateField(): DynamicField {
        const today = new Date();
        return new DynamicField({
            formGroup: null,
            label: '',
            labelPosition: { position: LabelPositions.Hidden, colsForLabel: null },
            name: 'effectiveDate',
            type: new DynamicFieldType({
                datepickerOptions: {
                    minDate: {
                        day: today.getDate(),
                        month: today.getMonth(),
                        year: today.getFullYear(),
                    },
                },
                fieldType: DynamicFieldTypes.Input,
                inputType: InputTypes.Datepicker,
            }),
            // eslint-disable-next-line @typescript-eslint/unbound-method
            validation: [ Validators.required ],
            validators: { 'required': true },
            value: new Date(),
        });
    }

    setEffectiveDateAndSubmit(): void {
        this.serviceUnitRule.EffectiveDate = this.effectiveDateControl.value;
        this.serviceUnitRule.Archived = true;
        this.serviceUnitRuleService.update(this.serviceUnitRule).subscribe(() => {
            this.notificationsService.success('Service unit rule archived successfully!');
            this.toggleModal();
        });
    }

    unarchiveRule(): void {
        this.serviceUnitRule.EffectiveDate = null;
        this.serviceUnitRule.Archived = false;
        this.serviceUnitRuleService.update(this.serviceUnitRule).subscribe(() => {
            this.notificationsService.success('Service unit rule unarchived successfully!');
        });
    }

    ngOnDestroy(): void {
        this.cdr.detach();
    }
}
