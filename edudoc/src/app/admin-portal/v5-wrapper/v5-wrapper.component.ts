import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '@common/environments/environment';

@Component({
    selector: 'app-v5-wrapper',
    template: `
        <iframe [src]="v5AppUrl" style="width: 100%; height: 100vh; border: none;"></iframe>
    `
})
export class V5WrapperComponent implements OnInit {
    v5AppUrl: SafeResourceUrl;

    constructor(
        private sanitizer: DomSanitizer,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        // Get path from query params, or determine based on current route
        let path = this.route.snapshot.queryParamMap.get('path');
        
        if (!path) {
            // Default path based on current route
            const currentPath = this.route.snapshot.url.join('/');
            if (currentPath.includes('new-treatment-therapy')) {
                path = '/encounters/encounter-form?serviceTypeId=3';
            } else if (currentPath.includes('auth-test')) {
                path = '/auth-test';
            }
        }
        
        this.v5AppUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.v5FrontendUrl}${path}`);
    }
} 