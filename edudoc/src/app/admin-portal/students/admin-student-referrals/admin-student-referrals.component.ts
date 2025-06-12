import { Component, Input, OnInit } from '@angular/core';
import { IStudent } from '@model/interfaces/student';
import { ISupervisorProviderStudentReferalSignOff } from '@model/interfaces/supervisor-provider-student-referal-sign-off';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { SortDirection } from '@mt-ng2/entity-list-module';
import { ProviderStudentReferralsService } from '@provider/case-load/services/provider-student-referrals.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-admin-student-referrals',
    templateUrl: './admin-student-referrals.component.html',
})
export class AdminStudentReferralsComponent implements OnInit {
    @Input() student: IStudent;

    studentReferrals: ISupervisorProviderStudentReferalSignOff[] = [];

    total: number;
    doubleClickIsDisabled = false;
    isHovered: boolean;
     

    subscriptions: Subscription;

    get noReferrals(): boolean {
        return !this.studentReferrals || this.studentReferrals.length === 0;
    }

    constructor(
        private providerStudentReferralsService: ProviderStudentReferralsService,
    ) {
        this.subscriptions = new Subscription();
    }

    ngOnInit(): void {
        this.getStudentReferals();
    }

    getStudentReferals(): void {
        const _extraSearchParams: ExtraSearchParams[] = this.buildSearch();

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: 'Id',
            orderDirection: SortDirection.Desc,
            query: '',
            take: 9999,
        };

        const searchparams = new SearchParams(searchEntity);
        this.providerStudentReferralsService.get(searchparams).subscribe((answer) => {
            this.studentReferrals = answer.body;
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    private buildSearch(): ExtraSearchParams[] {
        const _extraSearchParams: ExtraSearchParams[] = [];

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'StudentId',
                value: this.student.Id.toString(),
            }),
        );

        return _extraSearchParams;
    }

    viewProviderReferral(index: number): void {
        this.providerStudentReferralsService.viewReferrals(this.studentReferrals[index].Id).subscribe((resultBlob: Blob) => {
            const fileContents = new Blob([resultBlob], {
                type: 'application/pdf',
            });
            const fileURL = URL.createObjectURL(fileContents);
            window.open(fileURL, '_blank');
        });
    }

    private providerNameFormattingFunction(referral: ISupervisorProviderStudentReferalSignOff): string {
        return `${referral.SignedOffBy.LastName}, ${referral.SignedOffBy.FirstName}`;
    }
}
