import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { IGoal } from '@model/interfaces/goal';
import { BaseService } from '@mt-ng2/base-service';

export const emptyGoal: IGoal = {
    Archived: false,
    CreatedById: 0,
    DateCreated: new Date(),
    Description: '',
    Id: 0,
};

@Injectable({ providedIn: 'root' })
export class GoalService extends BaseService<IGoal> {
    _page = 1;
    _includeArchived = false;
    _query = '';

    setPage(value: number): void {
        this._page = value;
    }
    getPage(): number {
        return this._page;
    }

    setIncludeArchived(value: boolean): void {
        this._includeArchived = value;
    }
    getIncludeArchived(): boolean {
        return this._includeArchived;
    }

    setQuery(value: string): void {
        this._query = value;
    }
    getQuery(): string {
        return this._query;
    }

    constructor(public http: HttpClient) {
        super('/goals', http);
    }

    getEmptyGoal(): IGoal {
        return { ...emptyGoal };
    }

    formatTitleText(entity: IGoal): void {
        this.setTitle(`Goal: ${entity.Description}`);
    }
}
