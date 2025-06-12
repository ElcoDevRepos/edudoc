import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ISetting } from '@model/interfaces/setting';
import { BaseService } from '@mt-ng2/base-service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AppSettingsService extends BaseService<ISetting> {
    constructor(public http: HttpClient) {
        super('/settings', http);
    }

    updateSettings(settings: ISetting[]): Observable<void> {
        return this.http.put<void>('/settings/batch', settings);
    }
}
