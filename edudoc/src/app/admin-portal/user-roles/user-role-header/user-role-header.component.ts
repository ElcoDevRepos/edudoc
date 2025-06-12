import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { IUserRole } from '@model/interfaces/user-role';
import { UserRoleService } from '../user-role.service';

@Component({
    selector: 'app-user-header',
    templateUrl: './user-role-header.component.html',
})
export class UserRoleHeaderComponent implements OnInit, OnDestroy {
    userRole: IUserRole;
    header: string;
    subscriptions: Subscription = new Subscription();

    constructor(private userRoleService: UserRoleService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.subscriptions.add(
            this.userRoleService.changeEmitted$.subscribe((role) => {
                this.setHeader(role);
            }),
        );
        const id = +this.route.snapshot.paramMap.get('userRoleId');
        if (id > 0) {
            this.userRoleService.getById(id).subscribe((role) => {
                this.setHeader(role);
            });
        } else {
            this.header = 'Add User Role';
            this.userRole = this.userRoleService.getEmptyUserRole();
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    setHeader(role: IUserRole): void {
        this.userRole = role;
        this.header = `User Role: ${this.userRole.Name}`;
    }
}
