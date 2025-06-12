import { ModuleWithProviders, NgModule } from '@angular/core';

import { SharedModule } from '@common/shared.module';

import { SchoolDistrictAdminAssignmentComponent } from './components/school-district-admin-assignment/school-district-admin-assignment.component';
import { SchoolDistrictAdminInfoComponent } from './components/school-district-admin-info/school-district-admin-info.component';
import { SchoolDistrictBasicInfoComponent } from './components/school-district-basic-info/school-district-basic-info.component';
import { SchoolDistrictDetailComponent } from './components/school-district-detail/school-district-detail.component';
import { SchoolDistrictHeaderComponent } from './components/school-district-header/school-district-header.component';
import { SchoolDistrictActiveStatusDynamicCellComponent } from './components/school-district-list/school-district-active-status-cell/school-district-active-status-cell.component';
import { SchoolDistrictDownloadMerDynamicCellComponent } from './components/school-district-list/school-district-download-mer-cell/school-district-download-mer-cell.component';
import { SchoolDistrictsComponent } from './components/school-district-list/school-districts.component';
import { SchoolBasicInfoComponent } from './schools/components/school-basic-info/school-basic-info.component';
import { SchoolService } from './schools/services/school.service';
import { SchoolDistrictRostersService } from './services/school-district-rosters.service';
import { SchoolDistrictService } from './services/schooldistrict.service';
import { SchoolDistrictContactService } from './shared-entities/school-district-contact.service';

@NgModule({
    declarations: [
        SchoolDistrictsComponent,
        SchoolDistrictHeaderComponent,
        SchoolDistrictDetailComponent,
        SchoolDistrictBasicInfoComponent,
        SchoolBasicInfoComponent,
        SchoolDistrictAdminAssignmentComponent,
        SchoolDistrictAdminInfoComponent,
        SchoolDistrictActiveStatusDynamicCellComponent,
        SchoolDistrictDownloadMerDynamicCellComponent,
    ],
    imports: [SharedModule],
})
export class SchoolDistrictModule {
    static forRoot(): ModuleWithProviders<SchoolDistrictModule> {
        return {
            ngModule: SchoolDistrictModule,
            providers: [SchoolDistrictService, SchoolDistrictContactService, SchoolDistrictRostersService, SchoolService],
        };
    }
}
