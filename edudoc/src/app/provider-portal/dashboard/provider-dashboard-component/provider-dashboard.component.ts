import { ProviderSchoolDistrictService } from '@admin/providers/services/provider-school-district.service';
import { Component, OnInit } from '@angular/core';
import { ExtraSearchParams, IEntityExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { ProviderPortalAuthService } from '@provider/provider-portal-auth.service';
import { ProviderMessageService } from '../services/provider-message.service';
import { ILinkSelectorDTO } from '@model/interfaces/custom/link-selector.dto';

@Component({
    selector: 'app-provider-dashboard',
    styleUrls: ['./provider-dashboard-common-css.component.less'],
    templateUrl: './provider-dashboard.component.html',
})
export class ProviderDashboardComponent implements OnInit {
    providerId: number;
    isSupervisor = false;
    districtAssignments: string;
    escAssignments: string;
    bannerLoaded = false;
    documentLinks: ILinkSelectorDTO[];

    get districtBanner(): string {
        return this.escAssignments.length > 0 ? `ESC Assignments: ${this.escAssignments}` : `School District: ${this.districtAssignments}`;
    }

    constructor(
        private readonly providerPortalAuthService: ProviderPortalAuthService,
        private providerSchoolDistrictService: ProviderSchoolDistrictService,
        private providerMessageService: ProviderMessageService
    ) {}

    ngOnInit(): void {
        this.providerId = this.providerPortalAuthService.getProviderId();
        this.isSupervisor = this.providerPortalAuthService.providerIsSupervisor();
        this.getProviderAssignments();
        this.getLinksAndDocuments();
    }

    getProviderAssignments(): void {
        const searchParams = new SearchParams({
            query: null,
            extraParams: [
                {
                    name: 'providerIds',
                    valueArray: [this.providerPortalAuthService.getProviderId()],
                },
                {
                    name: 'archivedStatus',
                    valueArray: [0],
                },
            ],
            order: 'Id',
            orderDirection: 'Asc',
        });

        this.providerSchoolDistrictService.get(searchParams).subscribe((districtsResponse) => {
            this.escAssignments = districtsResponse.body.some((assignments) => assignments.Esc != null)
                ? districtsResponse.body
                      .map((assignments) => {
                          return assignments.Esc?.Name;
                      })
                      .filter((value, index, self) => {
                          return self.findIndex((esc: string) => esc === value) === index;
                      })
                      .join(',')
                : '';

            if (!(this.escAssignments.length > 0)) {
                const assignments = districtsResponse.body.filter((pe) => !pe.Archived).map((pe) => pe.ProviderEscSchoolDistricts);

                let distinct = [];

                for (const district of assignments) {
                    distinct = distinct.concat(district.map((pesd) => pesd.SchoolDistrict?.Name));
                }

                distinct = distinct.filter((value, index, self) => {
                    return self.indexOf(value) === index;
                });

                this.districtAssignments = distinct.join(', ').length > 0 ? distinct.join(', ') : 'No Assignments';
            }
            this.bannerLoaded = true;
        });
    }
    getLinksAndDocuments(): void {
        const _extraSearchParams: ExtraSearchParams[] = [];
        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'providerId',
                value: this.providerId.toString(),
            }),
        );

        this.providerMessageService
            .getDocumentsAndLinks({
                extraParams: _extraSearchParams,
                query: '',
            })
            .subscribe((data) => {
                this.documentLinks = data.body;
            });
    }
}
