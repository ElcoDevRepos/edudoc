import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '@common/environments/environment';

@Component({
    selector: 'app-v5-wrapper',
    template: `
        <iframe [src]="v5AppUrl" style="width: 100%; height: 100vh; border: none;"></iframe>
    `
})
export class V5WrapperComponent {
    v5AppUrl: SafeResourceUrl;

    constructor(private sanitizer: DomSanitizer) {
        this.v5AppUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.v5FrontendUrl}/auth-test`);
    }
} 