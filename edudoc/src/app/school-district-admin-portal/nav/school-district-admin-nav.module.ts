import { ModuleWithProviders, NgModule } from '@angular/core';

import { NavModule, NavSidebarServiceToken, NavModuleConfigToken } from '@mt-ng2/nav-module';

import { NavConfigOverride } from '@common/configs/nav.config';

import { SchoolDistrictAdminNavSidebarService } from './school-district-admin-sidebar.service';

@NgModule({
    exports: [NavModule],
    imports: [NavModule],
})
export class SchoolDistrictAdminNavModule {
    static forRoot(): ModuleWithProviders<SchoolDistrictAdminNavModule> {
        return {
            ngModule: SchoolDistrictAdminNavModule,
            providers: [
                { provide: NavSidebarServiceToken, useClass: SchoolDistrictAdminNavSidebarService },
                { provide: NavModuleConfigToken, useValue: NavConfigOverride },
            ],
        };
    }
}
