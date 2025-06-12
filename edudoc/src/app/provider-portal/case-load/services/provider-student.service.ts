import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIService } from '@common/api-service';
import { ICaseLoad } from '@model/interfaces/case-load';
import { IProviderCaseLoadDTO } from '@model/interfaces/custom/provider-student.dto';
import { IReferralSignOffRequest } from '@model/interfaces/custom/referral-sign-off-request.dto';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { IProviderStudentSupervisor } from '@model/interfaces/provider-student-supervisor';
import { IStudent } from '@model/interfaces/student';
import { IStudentType } from '@model/interfaces/student-type';
import { SearchParams } from '@mt-ng2/common-classes';
import { sortByProperty } from '@mt-ng2/common-functions';
import { Observable, Subject, of, tap } from 'rxjs';

export const emptySelectOption: ISelectOptions = {
    Archived: false,
    Id: 0,
    Name: '<< All >>',
};

export const emptyProviderStudentSupervisor: IProviderStudentSupervisor = {
    AssistantId: null,
    CreatedById: 0,
    DateCreated: new Date(),
    EffectiveStartDate: null,
    Id: 0,
    StudentId: null,
    SupervisorId: null,
};

@Injectable({ providedIn: 'root' })
export class ProviderStudentService extends APIService {
    private _studentTypes: IStudentType[];
    private selectedSchoolDistrict: number;

    protected studentSupervisorUpdateSource = new Subject<IStudent>();
    studentSupervisorUpdated$: Observable<IStudent> = this.studentSupervisorUpdateSource.asObservable();

    protected managedScheduleArchiveUpdateSource = new Subject<ICaseLoad>();
    managedScheduleArchiveUpdated$: Observable<ICaseLoad> = this.managedScheduleArchiveUpdateSource.asObservable();

    constructor(public http: HttpClient) {
        super('', http);
    }

    getEmptyProviderStudentSupervisor(): IProviderStudentSupervisor {
        return { ...emptyProviderStudentSupervisor };
    }

    searchStudents(csp: SearchParams): Observable<HttpResponse<IProviderCaseLoadDTO[]>> {
        return this.http.get<IProviderCaseLoadDTO[]>(`/case-load/provider/students`, { observe: 'response', params: this.getHttpParams(csp) });
    }

    searchStudentsForMissingReferrals(csp: SearchParams): Observable<HttpResponse<IProviderCaseLoadDTO[]>> {
        return this.http.get<IProviderCaseLoadDTO[]>(`/case-load/provider/students-missing-referrals`, { observe: 'response', params: this.getHttpParams(csp) });
    }

    searchNonCaseloadStudents(csp: SearchParams): Observable<HttpResponse<IStudent[]>> {
        return this.http.get<IStudent[]>(`/case-load/provider/students/non-caseload`, { observe: 'response', params: this.getHttpParams(csp) });
    }

    getStudentOptions(csp: SearchParams): Observable<HttpResponse<ISelectOptions[]>> {
        return this.http.get<ISelectOptions[]>(`/case-load/provider/student-options`, { observe: 'response', params: this.getHttpParams(csp) });
    }

    getSchoolDistricts(providerId: number): Observable<ISelectOptions[]> {
        return this.http.get<ISelectOptions[]>(`/providers/${providerId}/schooldistricts`).pipe(
            tap((answer: ISelectOptions[]) => {
                answer.push({ ...emptySelectOption });
                sortByProperty(answer, 'Id');
            }),
        );
    }

    getStudentById(studentId: number): Observable<IStudent> {
        return this.http.get<IStudent>(`/case-load/students/${studentId}`);
    }

    emitManagedScheduleArchived(caseLoad: ICaseLoad): void {
        this.managedScheduleArchiveUpdateSource.next(caseLoad);
    }

    getCaseLoadsByStudentId(studentId: number): Observable<ICaseLoad[]> {
        return this.http.get<ICaseLoad[]>(`/case-load/students/${studentId}/detail`);
    }

    getCaseLoadByTherapyScheduleId(therapyScheduleId: number): Observable<ICaseLoad> {
        return this.http.get<ICaseLoad>(`/case-load/schedule/${therapyScheduleId}/detail`);
    }

    getStudentTypes(): Observable<IStudentType[]> {
        if (!this._studentTypes) {
            return this.http.get<IStudentType[]>('/options/studentTypes').pipe(
                tap((answer) => {
                    sortByProperty(answer, 'Name');
                    this._studentTypes = answer;
                }),
            );
        } else {
            return of(this._studentTypes);
        }
    }

    getSupervisorOptions(providerId: number): Observable<ISelectOptions[]> {
        return this.http.get<ISelectOptions[]>(`/case-load/provider/${providerId}/supervisor-options`).pipe(
            tap((answer: ISelectOptions[]) => {
                answer.push({ ...emptySelectOption });
                sortByProperty(answer, 'Id');
            }),
        );
    }

    getAssistantOptions(providerId: number): Observable<ISelectOptions[]> {
        return this.http.get<ISelectOptions[]>(`/case-load/provider/${providerId}/assistant-options`).pipe(
            tap((answer: ISelectOptions[]) => {
                answer.push({ ...emptySelectOption });
                sortByProperty(answer, 'Id');
            }),
        );
    }

    assignStudentSupervisor(providerStudentSupervisor: IProviderStudentSupervisor): Observable<IProviderStudentSupervisor> {
        return this.http.put<IProviderStudentSupervisor>(`/case-load/students/assign-supervisor`, providerStudentSupervisor);
    }

    assignStudentAssistant(providerStudentSupervisor: IProviderStudentSupervisor): Observable<IProviderStudentSupervisor> {
        return this.http.put<IProviderStudentSupervisor>(`/case-load/students/assign-assistant`, providerStudentSupervisor);
    }

    updateProviderStudentSupervisor(providerStudentSupervisor: IProviderStudentSupervisor): Observable<IProviderStudentSupervisor> {
        return this.http.put<IProviderStudentSupervisor>(`/case-load/students/update-assignment`, providerStudentSupervisor);
    }

    unassignProviderStudentSupervisor(id: number): Observable<IProviderStudentSupervisor> {
        return this.http.get<IProviderStudentSupervisor>(`/case-load/students/unassign-assignment/${id}`);
    }

    signStudentReferral(referralSignOffRequest: IReferralSignOffRequest): Observable<number> {
        return this.http.put<number>(`/case-load/students/sign-referral`, referralSignOffRequest, {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        });
    }

    sendReminderEmail(studentId: number, providerId: number): Observable<void> {
        return this.http.get<void>(`/case-load/provider/${providerId}/send-reminder/${studentId}`);
    }

    removeStudentFromCaseLoad(studentId: number): Observable<void> {
        return this.http.put<void>(`/case-load/students/remove`, studentId);
    }

    getSelectedSchoolDistrict(): number {
        return this.selectedSchoolDistrict ?? null;
    }

    setSelectedSchoolDistrict(selectedDistrict: number): void {
        this.selectedSchoolDistrict = selectedDistrict;
    }

    emitStudentSupervisorChange(student: IStudent): void {
        this.studentSupervisorUpdateSource.next(student);
    }

    getProviderOptionsForMissingReferrals(providerId: number): Observable<ISelectOptions[]> {
        return this.http.get<ISelectOptions[]>(`/providers/${providerId}/missing-referral-options`).pipe(
            tap((answer: ISelectOptions[]) => {
                sortByProperty(answer, 'Name');
            }),
        );
    }

}
