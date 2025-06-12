import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ILabelGenerator } from './label-generator';
import { IProviderOdeCertification } from '@model/interfaces/provider-ode-certification';

@Component({
    selector: 'app-license-ode-list',
    templateUrl: './license-ode-list.component.html',
})
export class LicenseODEListComponent {
    @Input() cardName: string;
    @Input() entityName: string;
    @Input() items: IProviderOdeCertification[];
    @Input() canEdit: boolean;
    @Input() labelGenerator: ILabelGenerator;

    @Output() onAddItem: EventEmitter<void>;

    constructor() {
        this.onAddItem = new EventEmitter();
    }

    getItemContents(item: IProviderOdeCertification): string {
        const asOfString = new Date(item.AsOfDate).toLocaleDateString();
        const expString = new Date(item.ExpirationDate).toLocaleDateString();
        const extraLabelResult = this.labelGenerator.generateLabel(item);
        const certificationName = item.CertificationNumber;

        return `${this.entityName} <strong>${certificationName}</strong> ${extraLabelResult} valid as of <strong>${asOfString}</strong>, expires on <strong>${expString}</strong>`;
    }

    addItem(): void {
        this.onAddItem.emit();
    }
}
