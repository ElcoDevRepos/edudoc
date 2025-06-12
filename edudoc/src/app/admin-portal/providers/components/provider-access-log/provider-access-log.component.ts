import { Component, Input, OnInit } from '@angular/core';
import { IProvider } from '@model/interfaces/provider';
import { IRevokeAccess } from '@model/interfaces/revoke-access';
import { IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { RevokeAccessService } from '../provider-access-revocation/revoke-access.service';
import { RevokeAccessesEntityListConfig } from './revoke-accesses.entity-list-config';

@Component({
    selector: 'app-provider-access-log',
    templateUrl: './provider-access-log.component.html',
})
export class ProviderAccessLogComponent implements OnInit {
    @Input('provider') provider: IProvider;
    entityListConfig = new RevokeAccessesEntityListConfig();
    accessLogs: IRevokeAccess[] = [];
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection = this.entityListConfig.getDefaultSortDirection();

    constructor(
        private revokeAccessService: RevokeAccessService,
    ) {}

    ngOnInit(): void {
        this.getAccessLogs();
    }

    getAccessLogs(): void {
        this.revokeAccessService.getAccessLogs(this.provider.Id, this.buildSearch()).subscribe((answer) => {
            this.accessLogs = answer.body;
        });
    }

    buildSearch(): SearchParams {
        const searchEntity: IEntitySearchParams = {
            order: this.order,
            orderDirection: this.orderDirection,
            query: '',
        };
        return new SearchParams(searchEntity);
    }
}
