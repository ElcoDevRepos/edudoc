import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { concat, map, Observable, of, Subscription } from 'rxjs';

import { UserService } from '@admin/users/services/user.service';
import { IUser } from '@model/interfaces/user';

@Component({
    selector: 'app-user-header',
    templateUrl: './user-header.component.html',
})
export class UserHeaderComponent implements OnInit {
    header$: Observable<string>;
    user: IUser;
    headerPrefix: string;

    constructor(private userService: UserService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        const id = +this.route.snapshot.paramMap.get('userId');
        this.headerPrefix = this.route.snapshot.data.prefix;

        if (id) {
            this.header$ = concat(
                // Start with the current value
                this.userService.getById(id),
                // Update the value whenever it changes
                this.userService.changeEmitted$,
            ).pipe(map((u) => this.getHeaderFromUser(u)));
        } else {
            this.header$ = of('Add User');
        }
    }

    getHeaderFromUser(user: IUser): string {
        return `${this.headerPrefix}: ${user.FirstName} ${user.LastName}`;
    }
}
