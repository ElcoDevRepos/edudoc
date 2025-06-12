import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from '@common/environments/environment';
import { AppModule } from './app.module';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic()
    .bootstrapModule(AppModule, { preserveWhitespaces: true })
    // eslint-disable-next-line no-console
    .catch((err) => console.warn(err));
