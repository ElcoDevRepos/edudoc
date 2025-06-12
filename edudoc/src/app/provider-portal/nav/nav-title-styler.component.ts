import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavContentDynamicRowComponent } from '@mt-ng2/nav-module';

@Component({
    templateUrl: './nav-title-styler.component.html',
    styles: [`
        .hide-pointer {
            cursor: auto;
        }
        `]
})
export class NavStylerComponent extends NavContentDynamicRowComponent {

    constructor(public router: Router) { super(); }

    navigate(): void {
        if (this.row.link?.link) {
            void this.router.navigate([this.row.link]);
        }
    }
}
