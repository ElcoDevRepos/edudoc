import { Injectable } from '@angular/core';
import { ILabelGenerator } from '@common/interfaces/ILabelGenerator';
import { DateTimeConverterService } from '@common/services/date-time-converter.service';
import { ServiceCodeAcronymEnums } from '@model/enums/service-code.enum';
import { ICaseLoad } from '@model/interfaces/case-load';
import { ProviderPortalAuthService } from '@provider/provider-portal-auth.service';

@Injectable({ providedIn: 'root' })
export class CaseLoadLabelGenerator implements ILabelGenerator {

    get isNursingProvider(): boolean {
        return this.providerAuthService.getProviderServiceCode() === ServiceCodeAcronymEnums.HCN;
    }

    constructor(
        private providerAuthService: ProviderPortalAuthService,
        private dateTimeConverterService: DateTimeConverterService,
    ) {}

    GetLabel(entity: ICaseLoad): string {
        const dateLabel = entity.IepStartDate || entity.IepEndDate ? 'Date: ' + `<b>${entity.IepStartDate ? this.dateTimeConverterService.convertToDate(entity.IepStartDate) : ''} - ${entity.IepEndDate ? this.dateTimeConverterService.convertToDate(entity.IepEndDate) : ''}</b>` : '';
        return `<div class="status-log-info">Name: <b>${entity.StudentType.Name}</b> ${dateLabel}</div><div class="status-log-clear"></div>`;
    }

}
