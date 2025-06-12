import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { IUser } from '@model/interfaces/user';
import { SchoolDistrictAdminUserService } from '@school-district-admin/users/services/school-district-admin-user.service';

@Component({
    selector: 'app-school-district-admin-user-header',
    templateUrl: './school-district-admin-user-header.component.html',
})
export class SchoolDistrictAdminUserHeaderComponent implements OnInit, OnDestroy {
    header$: Observable<string>;
    user: IUser;
    header: string;
    subscriptions: Subscription = new Subscription();
    headerPrefix: string;

    constructor(private userService: SchoolDistrictAdminUserService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.subscriptions.add(
            this.userService.changeEmitted$.subscribe((user) => {
                this.setHeader(user);
            }),
        );
        const id = +this.route.snapshot.paramMap.get('userId');
        this.headerPrefix = this.route.snapshot.data.prefix;
        this.userService.getById(id).subscribe((user) => {
            this.setHeader(user);
        });

        this.userService.setInitialTitle(id);
        this.header$ = this.userService.title$;
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    setHeader(user: IUser): void {
        this.user = user;
        this.header = `${this.headerPrefix}: ${this.user.LastName}, ${this.user.FirstName}`;
    }
}