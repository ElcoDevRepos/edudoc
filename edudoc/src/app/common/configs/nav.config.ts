import { environment } from '@common/environments/environment';
import { INavModuleConfig } from '@mt-ng2/nav-module';

export const NavConfigOverride: INavModuleConfig = {
    collapseOnSiblingExpand: true,
    hasKeyboardShortcutsModule: true,
    highlightActiveChildRoutes: true,
    myProfilePath: './my-profile',
    showKeyboardShortcutsButton: true,
    siteName: environment.siteName || null,
    submitHelpUrl: environment.submitHelpUrl || null,
};
