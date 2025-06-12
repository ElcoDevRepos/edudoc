import { Component, OnInit } from '@angular/core';
import { ILinkSelectorDTO } from '@model/interfaces/custom/link-selector.dto';
import { AuthService } from '@mt-ng2/auth-module';
import { DistrictAdminMessageService } from '../services/district-admin-message.service';

@Component({
    selector: 'app-district-admin-dashboard',
    styleUrls: ['./district-admin-dashboard-common-css.component.less'],
    templateUrl: './district-admin-dashboard.component.html',
})
export class DistrictAdminDashboardComponent implements OnInit {
    userId: number;

    documentLinks: ILinkSelectorDTO[];

    constructor(
        private readonly authService: AuthService,
        private districtAdminMessageService: DistrictAdminMessageService
        ) {}

    ngOnInit(): void {
        this.userId = this.authService.currentUser.getValue().Id;
        this.districtAdminMessageService.getDocumentsAndLinks(this.userId).subscribe(data => {
            this.documentLinks = data;
        })
    }
}
