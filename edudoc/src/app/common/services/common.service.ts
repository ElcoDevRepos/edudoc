import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { sortByProperty } from '@mt-ng2/common-functions';
import { ICountriesService, ICountry, IState, IStatesService } from '@mt-ng2/dynamic-form';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable(
    {
        providedIn: 'root',
    },
)
export class CommonService implements IStatesService, ICountriesService {
    private _states: IState[];
    private _countries: ICountry[];

    constructor(private http: HttpClient) {}

    getStates(): Observable<IState[]> {
        if (!this._states) {
            return this.http.get<IState[]>('/options/states').pipe(
                tap((answer) => {
                    sortByProperty(answer, 'Name');
                    this._states = answer;
                }),
            );
        } else {
            return of(this._states);
        }
    }

    getCountries(): Observable<ICountry[]> {
        if (!this._countries) {
            return this.http.get<ICountry[]>('/options/countries').pipe(
                tap((answer) => {
                    sortByProperty(answer, 'Name');
                    const indexOfUS = answer.findIndex((country) => country.CountryCode === 'US');
                    answer.splice(0, 0, answer.splice(indexOfUS, 1)[0]);
                    this._countries = answer;
                }),
            );
        } else {
            return of(this._countries);
        }
    }
}
