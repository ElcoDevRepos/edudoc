import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMergeDTO } from '@model/interfaces/custom/merge.dto';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { IStudent } from '@model/interfaces/student';
import { BaseService } from '@mt-ng2/base-service';
import { SearchParams } from '@mt-ng2/common-classes';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MergeStudentsService extends BaseService<IStudent> {
    constructor(public http: HttpClient) {
        super('/students/merge', http);
    }

    getStudentOptions(csp: SearchParams): Observable<HttpResponse<ISelectOptions[]>> {
        return this.http.get<ISelectOptions[]>(`/students/merge/student-options`, { observe: 'response', params: this.getHttpParams(csp) });
    }

    mergeStudent(mergeDTO: IMergeDTO): Observable<object> {
        return this.http.put<object>(`/students/merge/execute`, mergeDTO);
    }
}
