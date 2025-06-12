import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIService } from '@common/api-service';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { IStudent } from '@model/interfaces/student';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SchoolDistrictSelectionService extends APIService {

    constructor(public http: HttpClient) {
        super('', http);
    }

    assignStudentEsc(escId: number, studentId: number): Observable<void> {
        return this.http.put<void>(`/case-load/students/${studentId}/assignEsc`, escId);
    }

    assignStudentSchool(student: IStudent): Observable<void> {

        return this.http.put<void>(`/case-load/students/assignSchool`, student);
    }

    getDistrictsByEscId(escId: number): Observable<ISchoolDistrict[]> {
        return this.http.get<ISchoolDistrict[]>(`/case-load/provider/${escId}/district-options`);
    }
}
