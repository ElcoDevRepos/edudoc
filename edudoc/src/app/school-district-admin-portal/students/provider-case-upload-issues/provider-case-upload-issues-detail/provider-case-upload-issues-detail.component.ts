import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NotificationsService } from '@mt-ng2/notifications-module';

import { IProviderCaseUpload } from '@model/interfaces/provider-case-upload';
import { ProviderCaseUploadIssuesService } from '../provider-case-upload-issues.service';

@Component({
    templateUrl: './provider-case-upload-issues-detail.component.html',
})
export class ProviderCaseUploadIssuesDetailComponent implements OnInit {
    providerCaseUpload: IProviderCaseUpload;
    isMerging: boolean;
    id: number;

    constructor(
        private providerCaseUploadIssuesService: ProviderCaseUploadIssuesService,
        private route: ActivatedRoute,
        private notificationsService: NotificationsService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.isMerging = false;
        // get current id from route
        this.id = +this.route.snapshot.paramMap.get('providerCaseUploadId');
        if (this.id) {
            this.getProviderCaseUploadById(this.id);
        } else {
            void this.router.navigate(['providerCaseUploads']); // if no id found, go back to list
        }
    }

    getProviderCaseUploadById(id: number): void {
        this.providerCaseUploadIssuesService.getById(id).subscribe((pcu) => {
            if (pcu === null) {
                this.notificationsService.error('ProviderCaseUpload not found');
                void this.router.navigate(['providerCaseUploads']);
            }
            this.providerCaseUpload = pcu;
            if (!pcu.HasDataIssues) {
                this.isMerging = pcu.HasDuplicates;
            }
        });
    }

    getIdFromRoute(route: ActivatedRoute, param: string): number {
        const id = route.snapshot.paramMap.get(param);
        return parseInt(id, 10) ? null : parseInt(id, 10);
    }
}
