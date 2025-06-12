import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-v5-wrapper',
    template: `
        <div class="row">
            <div class="col-md-12">
                <iframe 
                    [src]="v5AppUrl" 
                    style="width: 100%; height: calc(100vh - 120px); border: none;"
                    sandbox="allow-same-origin allow-scripts allow-forms"
                ></iframe>
            </div>
        </div>
    `
})
export class V5WrapperComponent {
    v5AppUrl: SafeResourceUrl;

    constructor(private sanitizer: DomSanitizer) {
        this.v5AppUrl = this.sanitizer.bypassSecurityTrustResourceUrl('http://localhost:4201/auth-test');
    }
} 