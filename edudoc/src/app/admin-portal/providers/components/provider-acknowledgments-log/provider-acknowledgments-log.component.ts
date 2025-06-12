import { Component, Input } from '@angular/core';
import { IProviderAcknowledgmentLog } from '@model/interfaces/provider-acknowledgment-log';

@Component({
    selector: 'app-provider-acknowledgment-logs',
    templateUrl: './provider-acknowledgments-log.component.html',
})
export class ProviderAcknowledgmentLogsComponent {
    @Input() acknowledgmentLogs: IProviderAcknowledgmentLog[];

    

    getLogLabelContents(log: IProviderAcknowledgmentLog): string {
        return `Training acknowledged on <strong>${new Date(log.DateAcknowledged).toLocaleDateString()}</strong>`;
    }
}
