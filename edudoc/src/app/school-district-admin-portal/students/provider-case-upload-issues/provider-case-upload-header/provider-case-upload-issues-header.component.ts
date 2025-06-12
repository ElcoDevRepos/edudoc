import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { IProviderCaseUpload } from '@model/interfaces/provider-case-upload';
import { ProviderCaseUploadIssuesService } from '../provider-case-upload-issues.service';

@Component({
    templateUrl: './provider-case-upload-issues-header.component.html',
})
export class ProviderCaseUploadIssuesHeaderComponent implements OnInit, OnDestroy {
    providerCaseUpload: IProviderCaseUpload;
    header: string;
    subscriptions: Subscription = new Subscription();

    constructor(private providerCaseUploadIssuesService: ProviderCaseUploadIssuesService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        // get the id from the route
        const id = +this.route.snapshot.paramMap.get('providerCaseUploadId');
        // set the header based on the id
        if (id > 0) {
            this.providerCaseUploadIssuesService.getById(id).subscribe((providerCaseUpload) => {
                this.setHeader(providerCaseUpload);
            });
        } else {
            this.setHeader(this.providerCaseUploadIssuesService.getEmptyProviderCaseUpload());
        }
        // subscribe to any changes in the providerCaseUpload service
        // which should update the header accordingly
        this.subscriptions.add(
            this.providerCaseUploadIssuesService.changeEmitted$.subscribe((providerCaseUpload) => {
                this.setHeader(providerCaseUpload);
            }),
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    setHeader(providerCaseUpload: IProviderCaseUpload): void {
        this.providerCaseUpload = providerCaseUpload;
        this.header = providerCaseUpload && providerCaseUpload.Id ? `Provider Case Upload: ${providerCaseUpload.FirstName} ${providerCaseUpload.LastName}` : 'Add ProviderCaseUpload';
    }
}
