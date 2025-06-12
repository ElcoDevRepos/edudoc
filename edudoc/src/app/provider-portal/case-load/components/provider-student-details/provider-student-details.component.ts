import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';

import { IStudent } from '@model/interfaces/student';

import { ActivatedRoute, Router } from '@angular/router';
import { ClaimTypes } from '@model/ClaimTypes';
import { ServiceCodeAcronymEnums } from '@model/enums/service-code.enum';
import { StudentTypes } from '@model/enums/student-types.enum';
import { ICaseLoad } from '@model/interfaces/case-load';
import { IIepService } from '@model/interfaces/iep-service';
import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { CaseLoadService } from '@provider/case-load/services/case-load.service';
import { ProviderPortalAuthService } from '@provider/provider-portal-auth.service';
import { StudentIEPServicesService } from '@school-district-admin/students/services/student-iep-services.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { ProviderStudentService } from '../../services/provider-student.service';
import { CaseLoadLabelGenerator } from '../provider-student-case-loads/case-load-label-generator';
import { ComponentCanDeactivate } from '@provider/case-load/services/case-load.guard';

@Component({
    selector: 'app-provider-student-details',
    templateUrl: './provider-student-details.component.html',
})
export class ProviderStudentDetailsComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
    @HostListener('window:beforeunload')
    canDeactivate(): Observable<boolean> | boolean {
        return this.caseLoads?.filter(c => !c.Archived).length > 0 || this.caseLoadsCount > 0;
    }
    student: IStudent;
    editingComponent: Subject<string> = new Subject();
    canEdit: boolean;
    canAdd: boolean;
    id: number;
    schoolId: number;
    //#region CaseLoads
    caseLoadExpanded = false;
    caseLoadLabelGenerator: CaseLoadLabelGenerator;
    caseLoadCardName = 'Plan Types';
    therapyScheduleCardName = 'Therapy Scehedules';
    caseLoads: ICaseLoad[];
    filteredCaseLoads: ICaseLoad[];
    includeArchivedCaseLoads = false;
    showingCaseLoads = true;
    caseLoadsCount: number;
    caseLoadsToShow = 3;
    initialLoad = true;
    referralTitles = [ServiceCodeAcronymEnums.AUD, ServiceCodeAcronymEnums.HCS, ServiceCodeAcronymEnums.HCO, ServiceCodeAcronymEnums.HCP];
    //#endregion

    caseLoadSelected: ICaseLoad;
    isSupervisor: boolean;
    providerServiceCode: number;
    addingNewCaseload: boolean;
    encounterId: number;
    providerId: number;
    iepService: IIepService;

    subscriptions = new Subscription();
    fromEncounter = false;
    encounterServiceTypeId: number;

    get closePath(): string {
        return `/provider/case-load/students`;
    }

    get showReferrals(): boolean {
        return this.providerAuthService.providerHasReferrals();
    }

    get isSpeechPathologistProvider(): boolean {
        return this.providerAuthService.providerIsSpeechPathologist();
    }

    get isNursingProvider(): boolean {
        return this.providerAuthService.getProviderServiceCode() === ServiceCodeAcronymEnums.HCN;
    }

    get hasReferrals(): boolean {
        return this.referralTitles.includes(this.providerAuthService.getProviderServiceCode());
    }

    get isSpeechProvider(): boolean {
        return this.providerAuthService.getProviderServiceCode() === ServiceCodeAcronymEnums.HCS;
    }

    get isAssistant(): boolean {
        return this.providerAuthService.providerIsAssistant();
    }

    get showAssistantSupervisors(): boolean {
        return this.providerAuthService.getProviderServiceCode() === ServiceCodeAcronymEnums.HCO || this.providerAuthService.getProviderServiceCode() === ServiceCodeAcronymEnums.HCP;
    }

    get isIEP(): boolean {
        return this.caseLoadSelected.StudentTypeId === StudentTypes.IEP;
    }

    get showEncounterReadyForYouIfAssistant(): boolean {
        return (this.isAssistant && this.student.ProviderStudentSupervisors.length > 0) || !this.isAssistant;
    }

    constructor(
        private studentService: ProviderStudentService,
        private caseLoadService: CaseLoadService,
        private claimsService: ClaimsService,
        private providerAuthService: ProviderPortalAuthService,
        private route: ActivatedRoute,
        private notificationsService: NotificationsService,
        private caseLabelGenerator: CaseLoadLabelGenerator,
        private studentIEPService: StudentIEPServicesService,
    ) {
        // route is case-load/student/:studentId
        this.caseLoadLabelGenerator = caseLabelGenerator;
    }

    ngOnInit(): void {
        // check claims
        this.canEdit = this.claimsService.hasClaim(ClaimTypes.Encounters, [ClaimValues.FullAccess]);
        this.canAdd = this.canEdit;
        // get current id from route
        this.id = +this.route.snapshot.paramMap.get('studentId');
        const queryParams = this.route.snapshot.queryParams;
        if (queryParams) {
            this.fromEncounter = queryParams.fromEncounter;
            this.encounterServiceTypeId = +queryParams.encounterServiceTypeId;
        }
        this.providerId = this.providerAuthService.getProviderId();
        this.getStudentById(this.id);
        this.editingComponent.next('');
        // Determine if provider needs to assign a supervisor
        this.isSupervisor = this.providerAuthService.providerIsSupervisor();
        this.providerServiceCode = this.providerAuthService.getProviderServiceCode();
        this.encounterId = +this.route.snapshot.queryParams.encounterId;
        this.subscriptions.add(this.studentService.studentSupervisorUpdated$.subscribe((student) => { this.student = student; }));
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    getStudentById(id: number): void {
        this.studentService.getStudentById(id).subscribe((student) => {
            if (student != null) {
                this.student = student;
                this.caseLoads = student?.CaseLoads;
                this.filterCaseLoads();
                this.iepService = student.IepServices[0] || this.studentIEPService.getEmptyIepService(id);
            }
        });
    }

    seeAllCaseLoads(): void {
        this.caseLoadsToShow = this.caseLoadsCount;
    }

    selectCaseLoad(caseLoad: ICaseLoad): void {
        this.caseLoadSelected = caseLoad;
        this.toggleCaseLoadsControl(false);
    }

    setCaseLoadIncludeArchived(include: boolean): void {
        this.includeArchivedCaseLoads = include;
        this.getStudentById(this.id);
    }

    deleteCaseLoad(caseLoad: ICaseLoad): void {
        caseLoad.Archived = !caseLoad.Archived;
        this.caseLoadService.update(caseLoad).subscribe(() => {
            this.notificationsService.success(`Case Load ${!caseLoad.Archived ? 'un' : ''}archived successfully!`);
            this.getStudentById(this.id);
            this.caseLoadsCount = this.caseLoadsCount--;
        },
        (error) => {
            caseLoad.Archived = !caseLoad.Archived;
            if (error.error) {
                this.error(error.error.ModelState as string);
            } else {
                this.notificationsService.error('Something went wrong');
            }
        });
    }

    error(msg?: string): void {
        if (!msg) {
            this.notificationsService.error('Something went wrong');
        } else {
            this.notificationsService.error(msg);
        }
    }

    filterCaseLoads(): void {
        this.filteredCaseLoads = this.caseLoads.filter((caseLoad) => caseLoad.Archived === this.includeArchivedCaseLoads || !caseLoad.Archived);
        const iepCaseLoad = this.filteredCaseLoads.find((caseLoad) => caseLoad.StudentTypeId === StudentTypes.IEP);
        if (iepCaseLoad && this.initialLoad) {
            this.selectCaseLoad(iepCaseLoad);
            this.initialLoad = false;
        }
    }

    toggleCaseLoadsControl(showLogs: boolean): void {
        if (showLogs === true) {
            this.getStudentById(this.id);
            if(this.filteredCaseLoads) {
                this.filteredCaseLoads.forEach(item => {
                    if(item.StudentTypeId !== StudentTypes.IEP) {
                        item.StudentTherapies['Archived'] = true;
                        this.caseLoadSelected.Archived = true;
                        this.studentService.emitManagedScheduleArchived(this.caseLoadSelected);
                    }
                });
            }
        }
        this.caseLoadExpanded = !this.caseLoadExpanded;
        this.showingCaseLoads = showLogs;
        this.caseLoadSelected = this.caseLoadExpanded ? this.caseLoadSelected : null;
    }

    addNewCaseLoad(): void {
        this.caseLoadSelected = this.caseLoadService.getEmptyCaseLoad();
        this.toggleCaseLoadsControl(false);
    }

    updateCaseloadCount(): void {
        this.caseLoadsCount = this.caseLoadsCount ? this.caseLoadsCount++ : 1;
    }

}
