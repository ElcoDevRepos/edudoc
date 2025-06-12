import { ModuleWithProviders, NgModule } from '@angular/core';

import { NavModule, NavSidebarServiceToken, NavModuleConfigToken } from '@mt-ng2/nav-module';

import { NavConfigOverride } from '@common/configs/nav.config';
import { AdminNavSidebarService } from './admin-sidebar.service';

@NgModule({
    exports: [NavModule],
    imports: [NavModule],
})
export class AppNavModule {
    static forRoot(): ModuleWithProviders<AppNavModule> {
        return {
            ngModule: AppNavModule,
            providers: [
                { provide: NavSidebarServiceToken, useClass: AdminNavSidebarService },
                { provide: NavModuleConfigToken, useValue: NavConfigOverride },
            ],
        };
    }
}
