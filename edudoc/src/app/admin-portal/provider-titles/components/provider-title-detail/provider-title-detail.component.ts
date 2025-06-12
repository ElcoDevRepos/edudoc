import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { NotificationsService } from '@mt-ng2/notifications-module';

import { ClaimTypes } from '@model/ClaimTypes';
import { IProviderTitle } from '@model/interfaces/provider-title';
import { ProviderTitleService } from '../../services/provider-title.service';

@Component({
    templateUrl: './provider-title-detail.component.html',
})
export class ProviderTitleDetailComponent implements OnInit {
    providerTitle: IProviderTitle;
    canEdit: boolean;
    canAdd: boolean;

    constructor(
        private providerTitleService: ProviderTitleService,
        private claimsService: ClaimsService,
        private route: ActivatedRoute,
        private notificationsService: NotificationsService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        // check claims
        this.canEdit = this.claimsService.hasClaim(ClaimTypes.AppSettings, [ClaimValues.FullAccess]);
        this.canAdd = this.canEdit;
        // get current id from route
        const id = this.getIdFromRoute(this.route, 'providerTitleId');
        if (id) {
            this.getProviderTitleById(id);
        } else {
            void this.router.navigate(['provider-titles']); // if no id found, go back to list
        }
    }

    getProviderTitleById(id: number): void {
        this.providerTitleService.getById(id).subscribe((providerTitle) => {
            if (providerTitle === null) {
                this.notificationsService.error('Provider Title not found');
                void this.router.navigate(['provider-titles']);
            }
            this.providerTitle = providerTitle;
        });
    }

    getIdFromRoute(route: ActivatedRoute, param: string): number {
        const id = route.snapshot.paramMap.get(param);
        return Number.isNaN(parseInt(id, 10)) ? null : parseInt(id, 10);
    }
}
