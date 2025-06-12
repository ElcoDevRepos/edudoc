import { Component } from '@angular/core';

@Component({
    selector: 'app-header',
    styles: [`
            .miles-blue-text-color {
                color: #004aa0;
            }
            .main-header {
                background: #fff;
                padding: 15px;
                color: #444;
                border-bottom: 1px solid #6b8a8c;
                margin-top: 50px;
            }
        `],
    templateUrl: './header.component.html',
})
export class HeaderComponent {}
