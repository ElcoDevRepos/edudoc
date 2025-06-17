import { APP_BASE_HREF, PathLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from 'ngx-progressbar/http';

import { AuthModule, ClaimsService } from '@mt-ng2/auth-module';
import { EnvironmentModule, EnvironmentModuleConfigToken } from '@mt-ng2/environment-module';
import { BreckErrorHandler } from '@mt-ng2/errors-module';
import { MtLoginModule, LoginModuleConfigToken } from '@mt-ng2/login-module';
import { NotificationsModule } from '@mt-ng2/notifications-module';
import { MtDisableDuringHttpCallsModule } from '@mt-ng2/disable-during-http-calls';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginConfigOverride } from './common/configs/login.config';

import { ToastrModule } from 'ngx-toastr';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '@common/environments/environment';
import { HCPCLoginComponent } from '@common/login/HCPC-login.component';
import { AdminAccessComponent } from '@common/login/admin-access.component';
import { ForgotPasswordComponent } from '@common/login/forgot-password.component';
import { ResetPasswordComponent } from '@common/login/reset-password.component';
import { SharedModule } from '@common/shared.module';
import { EntityListModule, IEntityListModuleConfig, EntityListModuleConfigToken } from '@mt-ng2/entity-list-module';
import { KeyboardShortcutModule, KeyboardShortcutService } from '@mt-ng2/keyboard-shortcuts-module';
import { LoginModuleOverrideAuthServiceToken } from '@mt-ng2/login-module';

import { NotFoundComponent } from './default-routes/not-found/not-found.component';
import { RouteResolverComponent } from './default-routes/route-resolver.component';
import { CookieModule } from '@mt-ng2/cookie';
import { NavModule } from '@mt-ng2/nav-module';

export const entityListModuleConfig: IEntityListModuleConfig = {
    itemsPerPage: 10,
};

@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        HCPCLoginComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        AdminAccessComponent,
        RouteResolverComponent,
        NotFoundComponent,
    ],
    exports: [NavModule,],
    imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    CookieModule.forRoot(),
    HttpClientModule,
    NgProgressModule.withConfig({
        color: '#ff8b56',
        spinnerPosition: 'left',
        thick: false,
    }),
    NgProgressHttpModule,
    EnvironmentModule,
    AuthModule.forRoot(),
    MtDisableDuringHttpCallsModule.forRoot(),
    NotificationsModule,
    NgxMaskModule.forRoot(),
    MtLoginModule,
    ToastrModule.forRoot({
        positionClass: 'toast-top-left',
    }),
    KeyboardShortcutModule,
    EntityListModule,
    AppRoutingModule,
    SharedModule.forRoot(),
    MtDisableDuringHttpCallsModule.forRoot(),
    NavModule,
],
    providers: [
        ClaimsService,
        KeyboardShortcutService,
        { provide: ErrorHandler, useClass: BreckErrorHandler },
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: APP_BASE_HREF, useValue: '/v4/' },
        { provide: EntityListModuleConfigToken, useValue: entityListModuleConfig },
        { provide: LoginModuleOverrideAuthServiceToken, useValue: LoginConfigOverride },
        { provide: LoginModuleConfigToken, useValue: LoginConfigOverride },
		{ provide: EnvironmentModuleConfigToken, useValue: environment },
    ],
})
export class AppModule {}
