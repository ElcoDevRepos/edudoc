import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { IEntity } from '@model/interfaces/base';
import { SearchParams } from '@mt-ng2/common-classes';
import { AppError, NotFoundError } from '@mt-ng2/errors-module';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export abstract class APIService {
    constructor(private baseurl: string, protected http: HttpClient) {}

    post(object: IEntity, url: string): Observable<HttpResponse<IEntity> | Response | AppError> {
        const clone: unknown = JSON.parse(JSON.stringify(object));
        return this.http.post<unknown>(`${this.baseurl}/${url}`, clone).pipe(catchError((err, caught) => this.handleError(err as Response, caught)));
    }

    handleError(error: Response, formObject?: Observable<HttpResponse<IEntity> | unknown>): Observable<Response | AppError> {
        if (error.status === 400) {
            return throwError(error);
        }

        if (error.status === 404) {
            return throwError(new NotFoundError());
        }

        return throwError(new AppError(error, formObject));
    }

    get(searchparameters: SearchParams, url: string): Observable<HttpResponse<IEntity> | Response | AppError> {
        const params = this.getHttpParams(searchparameters);
        return this.http
            .get<IEntity>(this.baseurl + url, {
                observe: 'response',
                params: params,
            })
            .pipe(catchError((err, caught) => this.handleError(err as Response, caught)));
    }

    protected getHttpParams(searchparameters: SearchParams): HttpParams {
        let params = new HttpParams();
        if (searchparameters.query) {
            params = params.append('query', searchparameters.query);
        }
        if (searchparameters.skip) {
            params = params.append('skip', searchparameters.skip.toString());
        }
        if (searchparameters.take) {
            params = params.append('take', searchparameters.take.toString());
        }
        if (searchparameters.order) {
            params = params.append('order', searchparameters.order.toString());
        }
        if (searchparameters.orderDirection) {
            params = params.append('orderDirection', searchparameters.orderDirection.toString());
        }
        if (searchparameters.extraParams && searchparameters.extraParams.length > 0) {
            let extraparams = new HttpParams();
            searchparameters.extraParams.forEach((param) => {
                if (param.valueArray) {
                    if (param.valueArray.length > 0) {
                        extraparams = extraparams.append(param.name, param.valueArray.toString());
                    }
                } else {
                    if (param.value.length > 0) {
                        extraparams = extraparams.set(param.name, param.value);
                    }
                }
            });
            if (extraparams.keys().length > 0) {
                params = params.append('extraparams', extraparams.toString());
            }
        }
        return params;
    }
}
/*
delete(endpoint: string, id: number): Observable<any> {
    return this.http.delete(this.baseurl  + '/' + endpoint + '/' + id)
        .pipe(catchError(this.handleError));
}

put(endpoint: string, object: any): Observable<any> {
    const clone: any = JSON.parse(JSON.stringify(object));
    return this.http
        .put(this.baseurl + '/' + endpoint + '/' + clone.Id, clone)
        .pipe(catchError(this.handleError));
}

putList(endpoint: string, object: any[]): Observable<any> {
    return this.http.put(this.baseurl + '/' + endpoint , object).pipe(catchError(this.handleError));
}
*/
