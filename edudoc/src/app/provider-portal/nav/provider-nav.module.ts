import { ModuleWithProviders, NgModule } from '@angular/core';

import { NavModule, NavSidebarServiceToken, NavModuleConfigToken } from '@mt-ng2/nav-module';

import { NavConfigOverride } from '@common/configs/nav.config';
import { NavStylerComponent } from './nav-title-styler.component';
import { ProviderNavSidebarService } from './provider-sidebar.service';

@NgModule({
    declarations: [NavStylerComponent],
    exports: [NavModule],
    imports: [NavModule],
})
export class ProviderNavModule {
    static forRoot(): ModuleWithProviders<ProviderNavModule> {
        return {
            ngModule: ProviderNavModule,
            providers: [
                { provide: NavSidebarServiceToken, useClass: ProviderNavSidebarService },
                { provide: NavModuleConfigToken, useValue: NavConfigOverride },
            ],
        };
    }
}
