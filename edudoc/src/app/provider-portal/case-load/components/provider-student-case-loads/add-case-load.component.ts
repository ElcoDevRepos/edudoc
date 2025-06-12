import { DisabilityCodeService } from '@admin/managed-list-items/managed-item-services/disability-code.service';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceCodeAcronymEnums } from '@model/enums/service-code.enum';
import { ICaseLoad } from '@model/interfaces/case-load';
import { ICaseLoadScript } from '@model/interfaces/case-load-script';
import { IDiagnosisCode } from '@model/interfaces/diagnosis-code';
import { IDisabilityCode } from '@model/interfaces/disability-code';
import { IStudent } from '@model/interfaces/student';
import { IStudentType } from '@model/interfaces/student-type';
import { AuthService } from '@mt-ng2/auth-module';
import { IMetaItem } from '@mt-ng2/base-service';
import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { DynamicField, DynamicLabel } from '@mt-ng2/dynamic-form';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { CaseLoadCptCodesService } from '@provider/case-load/services/case-load-cpt-codes.service';
import { CaseLoadGoalsService } from '@provider/case-load/services/case-load-goals.service';
import { CaseLoadMethodsService } from '@provider/case-load/services/case-load-methods.service';
import { CaseLoadScriptsService } from '@provider/case-load/services/case-load-scripts.service';
import { CaseLoadService } from '@provider/case-load/services/case-load.service';
import { ProviderStudentService } from '@provider/case-load/services/provider-student.service';
import { ValidateCaseLoadStudentType } from '@provider/common/validators/case-load-student-type.validator';
import { ProviderPortalAuthService } from '@provider/provider-portal-auth.service';
import { forkJoin, of } from 'rxjs';
import 'rxjs/operators';
import { catchError, concatMap, finalize } from 'rxjs/operators';
import { IScriptAndFile } from './case-load-options/case-load-scripts/add-case-load-script.component';
import { CaseLoadDynamicConfig } from './case-load.dynamic-config';
import { EncounterServiceTypes } from '@model/enums/encounter-service-types.enum';

@Component({
    selector: 'app-add-case-load',
    templateUrl: './add-case-load.component.html',
})
export class AddCaseLoadComponent implements OnInit {
    @Output('onClose') onClose: EventEmitter<void> = new EventEmitter<void>();
    @Output('onUpdate') onUpdate: EventEmitter<void> = new EventEmitter<void>();
    @Input() canEdit: boolean;
    @Input() student: IStudent;
    @Input() caseLoad: ICaseLoad;
    @Input() addingNewCaseload: boolean;
    @Input() encounterId: number;
    @Input() fromEncounter: boolean;
    @Input() encounterServiceTypeId: number;

    studentTypes: IStudentType[];
    diagnosisCodes: IDiagnosisCode[];
    disabilityCodes: IDisabilityCode[];
    reasonForServiceOptions: IMetaItem[];
    providerId: number;
    isEditing = false;
    isHovered = false;
    isNursingProvider = false;
    isSpeechProvider = false;
    billableSelected = false;
    iepDatesRequired = false;

    scripts: IScriptAndFile[] = [];

    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    form: UntypedFormGroup;
    formFactory: CaseLoadDynamicConfig<ICaseLoad>;
    doubleClickIsDisabled = false;
    usesDisabilityCodes: boolean;

    // submenu states
    scriptsEditing: false;

    get addingBillable(): boolean {
        return this.caseLoad.Id === 0 && this.billableSelected;
    }

    get subMenuEditing(): boolean {
        return this.scriptsEditing;
    }

    get isBillable(): boolean {
        return this.caseLoad.StudentType?.IsBillable;
    }

    constructor(
        private caseLoadService: CaseLoadService,
        private providerStudentService: ProviderStudentService,
        private disabilityCodesService: DisabilityCodeService,
        private providerIdService: ProviderPortalAuthService,
        private notificationsService: NotificationsService,
        private caseLoadGoalsService: CaseLoadGoalsService,
        private caseLoadMethodsService: CaseLoadMethodsService,
        private caseLoadCptService: CaseLoadCptCodesService,
        private caseLoadScriptService: CaseLoadScriptsService,
        private router: Router,
        private authService: AuthService,
        private cdr: ChangeDetectorRef,
        private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.usesDisabilityCodes = this.student && this.student.School.SchoolDistrictsSchools.some((sds) => sds.SchoolDistrict.UseDisabilityCodes);
        this.iepDatesRequired = this.student && this.student.School.SchoolDistrictsSchools.some((sds) => sds.SchoolDistrict.IepDatesRequired);
        this.providerId = this.providerIdService.getProviderId();
        this.isNursingProvider = this.providerIdService.getProviderServiceCode() === ServiceCodeAcronymEnums.HCN;
        this.isSpeechProvider = this.providerIdService.getProviderServiceCode() === ServiceCodeAcronymEnums.HCS;
        const queryParams = this.route.snapshot.queryParams;
        if (queryParams) {
            this.encounterId = +queryParams.encounterId;
            this.fromEncounter = queryParams.fromEncounter;
            this.encounterServiceTypeId = +queryParams.encounterServiceTypeId;
        }
        forkJoin([
            this.providerStudentService.getStudentTypes(),
            this.disabilityCodesService.getAll(),
            this.caseLoadService.getReasonForServiceOptions(this.providerId),
        ]).subscribe(([studentTypes, disabilityCodeOptions, reasonForServiceOptions]) => {
            this.studentTypes = studentTypes;
            this.disabilityCodes = disabilityCodeOptions;
            this.diagnosisCodes = reasonForServiceOptions;
            this.reasonForServiceOptions = reasonForServiceOptions.map((dc) => ({
                Id: dc.Id,
                Name: `${dc.Code} - ${dc.Description || 'No Description'}`,
            }));
            this.setConfig();
        });
    }

    setConfig(): void {
        if (this.caseLoad == null) {
            this.caseLoad = this.caseLoadService.getEmptyCaseLoad();
        }
        this.scripts = [];
        this.formFactory = new CaseLoadDynamicConfig<ICaseLoad>(
            this.caseLoad,
            this.studentTypes.filter((st) => st.IsBillable),
            this.studentTypes.filter((st) => !st.IsBillable),
            this.reasonForServiceOptions,
            this.disabilityCodes,
            this.usesDisabilityCodes,
            this.isNursingProvider,
            this.iepDatesRequired,
        );
        const config = this.caseLoad.Id === 0 ? this.formFactory.getForCreate() : this.formFactory.getForUpdate();
        this.viewOnly = config?.viewOnly?.map((x) => new DynamicLabel(x));
        this.formObject = config?.formObject?.map((x) => new DynamicField(x));

        if (this.caseLoad.Id === 0) {
            // new case load
            this.isEditing = true;
        }
    }

    formCreated(formGroup: UntypedFormGroup): void {
        const caseLoadGroup = formGroup.controls.CaseLoad as UntypedFormGroup;
        if (this.caseLoad && this.caseLoad.Id === 0) {
            formGroup.setValidators(ValidateCaseLoadStudentType());
        }
        this.disableControl(caseLoadGroup.controls.DiagnosisCodeId, false);
        formGroup.get('CaseLoad.BillableStudentTypeId').valueChanges.subscribe((value) => {
            if (value) {
                this.enableControl(caseLoadGroup.controls.DiagnosisCodeId, true);
                caseLoadGroup.controls.IepStartDate.enable();
                caseLoadGroup.controls.IepEndDate.enable();
                caseLoadGroup.controls.NonBillableStudentTypeId.setValue(null);
                this.billableSelected = true;
                this.cdr.detectChanges();
            }
        });

        formGroup.get('CaseLoad.NonBillableStudentTypeId').valueChanges.subscribe((value) => {
            if (value) {
                this.disableControl(caseLoadGroup.controls.DiagnosisCodeId, true);
                this.disableControl(caseLoadGroup.controls.IepStartDate, true);
                this.disableControl(caseLoadGroup.controls.IepEndDate, true);
                caseLoadGroup.controls.BillableStudentTypeId.setValue(null);
                caseLoadGroup.controls.IepStartDate.setValue(null);
                caseLoadGroup.controls.IepEndDate.setValue(null);
                caseLoadGroup.controls.DiagnosisCodeId?.setValue(null);
                this.billableSelected = false;
                this.cdr.detectChanges();
            }
        });
    }

    private enableControl(control: AbstractControl, required: boolean): void {
        if (control) {
            control.enable();
            control.mtSetRequired(required);
        }
    }

    private disableControl(control: AbstractControl, clearValue: boolean): void {
        if (control) {
            control.disable();
            control.mtSetRequired(false);
            control.markAsUntouched();
            if (clearValue) {
                control.setValue(null);
            }
        }
    }

    formSubmitted(form: UntypedFormGroup): void {
        const scriptError = this.addingBillable && this.isNursingProvider && !this.scripts.length;
        const goalError = this.addingBillable && !this.isNursingProvider && !(this.caseLoad.CaseLoadGoals && this.caseLoad.CaseLoadGoals.length);
        const cptCodeError =
            this.addingBillable && !this.isNursingProvider && !(this.caseLoad.CaseLoadCptCodes && this.caseLoad.CaseLoadCptCodes.length);
        if (form.valid && !scriptError && !goalError && !cptCodeError) {
            form.clearValidators();
            this.formatDataForSave(form);
            if (!this.caseLoad.Id || this.caseLoad.Id === 0) {
                this.caseLoadService.create(this.caseLoad).subscribe((answer) => {
                    if (this.billableSelected) {
                        const saveCptCodes =
                            this.caseLoad.CaseLoadCptCodes?.map((clcpt) => {
                                const caseLoadCptCode = this.caseLoadCptService.getEmptyCaseLoadCptCode();
                                caseLoadCptCode.CaseLoadId = answer;
                                caseLoadCptCode.CreatedById = this.authService.currentUser.getValue().Id;
                                caseLoadCptCode.CptCodeId = clcpt.CptCodeId;
                                caseLoadCptCode.Default = clcpt.Default;
                                return this.caseLoadCptService.createWithFks(caseLoadCptCode);
                            }) || [];
                        const saveScripts = this.isNursingProvider
                            ? this.scripts.map((x) => {
                                  const script: ICaseLoadScript = {
                                      ...x.Script,
                                      CaseLoadId: answer,
                                      CaseLoadScriptGoals: x.Script.CaseLoadScriptGoals?.map((g) => ({
                                          ...g,
                                          Goal: null,
                                      })),
                                      Id: 0,
                                  };
                                  return this.caseLoadScriptService.createWithFks(script).pipe(
                                      concatMap((scriptId) => {
                                          script.Id = scriptId;
                                          return this.caseLoadScriptService.upload(script, x.File);
                                      }),
                                  );
                              })
                            : [];
                        const saveMethods = this.isSpeechProvider
                            ? this.caseLoad.CaseLoadMethods?.map((clm) => {
                                  const caseLoadMethod = this.caseLoadMethodsService.getEmptyCaseLoadMethod();
                                  caseLoadMethod.CaseLoadId = answer;
                                  caseLoadMethod.CreatedById = this.authService.currentUser.getValue().Id;
                                  caseLoadMethod.MethodId = clm.MethodId;
                                  return this.caseLoadMethodsService.createWithFks(caseLoadMethod);
                              }) || []
                            : [];
                        const saveGoals = !this.isNursingProvider
                            ? this.caseLoad.CaseLoadGoals?.map((clg) => {
                                  const caseLoadGoal = this.caseLoadGoalsService.getEmptyCaseLoadGoal();
                                  caseLoadGoal.CaseLoadId = answer;
                                  caseLoadGoal.CreatedById = this.authService.currentUser.getValue().Id;
                                  caseLoadGoal.GoalId = clg.GoalId;
                                  return this.caseLoadGoalsService.createWithFks(caseLoadGoal);
                              }) || []
                            : [];
                        forkJoin([...saveCptCodes, ...saveScripts, ...saveGoals, ...saveMethods])
                            .pipe(
                                catchError(() => {
                                    this.notificationsService.error('Something went wrong, case load partially saved.');
                                    return of([]);
                                }),
                                finalize(() => {
                                    this.caseLoad.Id = answer;
                                }),
                            )
                            .subscribe(() => {
                                this.success();
                                this.setConfig();
                                this.isEditing = false;
                            });
                    } else {
                        this.caseLoad.Id = answer;
                        this.success();
                        this.setConfig();
                        this.isEditing = false;
                    }
                });
            } else {
                this.caseLoadService.update(this.caseLoad).subscribe(() => {
                    this.isEditing = false;
                    this.success();
                    this.setConfig();
                    this.close();
                });
            }
        } else {
            markAllFormFieldsAsTouched(form);
            if (form.errors?.noStudentTypeId) {
                this.error('Please select a student type.');
            } else if (cptCodeError) {
                this.error('At least one Procedure Code is required.');
            } else if (goalError) {
                this.error('At least one Goal is required.');
            } else if (scriptError) {
                this.error('At least one Script is required.');
            } else {
                this.error();
            }
        }
    }

    formatDataForSave(form: UntypedFormGroup): void {
        this.formFactory.assignFormValues(this.caseLoad, form.value.CaseLoad as ICaseLoad);
        this.caseLoad.ServiceCodeId = this.providerIdService.getProviderServiceCode();
        this.caseLoad.StudentId = this.student.Id;
        if (form.value.CaseLoad.BillableStudentTypeId !== null) {
            this.caseLoad.StudentTypeId = form.value.CaseLoad.BillableStudentTypeId;
        } else {
            this.caseLoad.StudentTypeId = form.value.CaseLoad.NonBillableStudentTypeId;
            this.caseLoad.DiagnosisCodeId = null;
            this.caseLoad.IepStartDate = null;
            this.caseLoad.IepEndDate = null;
        }
        this.caseLoad.StudentType = this.studentTypes.find((st) => st.Id === this.caseLoad.StudentTypeId);
        this.caseLoad.DiagnosisCode = this.diagnosisCodes.find((dc) => dc.Id === this.caseLoad.DiagnosisCodeId);
    }

    edit(): void {
        if (this.canEdit) {
            this.isEditing = true;
        }
    }

    error(message?: string): void {
        const errorMessage = message ? message : 'Save failed.  Please check the case load form and try again.';
        this.notificationsService.error(errorMessage);
    }

    success(): void {
        this.caseLoadService.emitChange(this.caseLoad);
        this.notificationsService.success('Saved Successfully');
        this.onUpdate.emit();
        if (this.addingNewCaseload) {
            if (this.encounterId > 0) {
                void this.router.navigate(['/provider/encounters/', this.encounterId], { queryParams: { studentId: this.student.Id } });
            } else {
                void this.router
                    .navigateByUrl('/provider/', { skipLocationChange: true })
                    .then(() => void this.router.navigate(['/provider/case-load/student', this.student.Id]));
            }
        } else if (this.fromEncounter && this.encounterId > 0 && this.encounterServiceTypeId > 0) {
            if (this.encounterServiceTypeId == EncounterServiceTypes.Treatment_Therapy) {
                void this.router.navigate(['/provider/encounters/treatment-therapy', this.encounterId], { queryParams: { fromEncounter: true } });
            } else if (this.encounterServiceTypeId == EncounterServiceTypes.Evaluation_Assessment) {
                void this.router.navigate(['/provider/encounters/evaluation', this.encounterId], { queryParams: { fromEncounter: true } });
            } else if (this.encounterServiceTypeId == EncounterServiceTypes.Other_Non_Billable) {
                void this.router.navigate(['/provider/encounters/non-msp', this.encounterId], { queryParams: { fromEncounter: true } });
            }
        }
    }

    close(): void {
        this.onClose.emit();
    }

    cancelClick(): void {
        if (this.encounterId) {
            void this.router.navigate(['/provider/encounters/', this.encounterId]);
        } else if (this.addingNewCaseload) {
            void this.router.navigate(['provider/case-load/students']);
        } else {
            this.onClose.emit();
        }
    }

    scriptsChanged(value: IScriptAndFile[]): void {
        this.scripts = [...value];
    }
}
