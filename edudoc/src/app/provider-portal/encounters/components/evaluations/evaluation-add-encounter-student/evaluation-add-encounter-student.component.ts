import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DateTimeConverterService } from "@common/services/date-time-converter.service";
import { IEncounter } from "@model/interfaces/encounter";
import { IEncounterLocation } from "@model/interfaces/encounter-location";
import { IEncounterStudent } from "@model/interfaces/encounter-student";
import { ITherapyCaseNote } from "@model/interfaces/therapy-case-note";
import { MetaItem } from "@mt-ng2/base-service";
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType, InputTypes, LabelPosition, LabelPositions, SelectInputTypes } from "@mt-ng2/dynamic-form";
import { IModalOptions } from "@mt-ng2/modal-module";
import { NotificationsService } from "@mt-ng2/notifications-module";

import { TherapyCaseNoteService } from "@provider/case-load/services/therapy-case-notes.service";
import { EncounterStudentService } from "@provider/encounters/services/encounter-student.service";
import { EncounterService } from "@provider/encounters/services/encounter.service";
import { forkJoin } from "rxjs";
import { IStudentDeviationReason } from "@model/interfaces/student-deviation-reason";
import { EncounterStudentCptCodesService } from "@provider/encounters/services/encounter-student-cpt-codes.service";
import { EncounterStatuses } from "@model/enums/encounter-status.enum";
import { AbstractControl, UntypedFormGroup, Validators } from "@angular/forms";
import { DaysOfTheWeek } from "@mt-ng2/search-filter-daterange-control";

@Component({
    selector: 'app-evaluation-add-encounter-student',
    styleUrls: ['./evaluation-add-encounter-student.component.less'],
    templateUrl: './evaluation-add-encounter-student.component.html',
})
export class EvaluationAddEncounterStudentComponent implements OnInit {
    @Input() encounter: IEncounter;
    @Input() studentId: number;
    @Input() encounterStudent: IEncounterStudent;
    @Input() locations: IEncounterLocation[];
    @Input() deviationReasons: IStudentDeviationReason[];
    @Output() closeAddEncounterStudentModal = new EventEmitter<void>();
    @Output() encounterStudentUpdated = new EventEmitter<void>();

    modalOptions: IModalOptions = {
        showCloseButton: false,
        showConfirmButton: false,
        width: '80%',
    };

    // forms
    formObject: DynamicField[] = [];
    studentFormForSave: UntypedFormGroup;

    // Therapy Case Notes
    storedTherapyNotes: ITherapyCaseNote[];
    storedNotesControl: AbstractControl;
    notesControl: AbstractControl;
    notesField: DynamicField;
    showNotes = true;

    defaultLocationId: number;

    get hasDeviationReason(): boolean {
        return this.encounterStudent.StudentDeviationReasonId && this.encounterStudent.StudentDeviationReasonId > 0;
    }

    constructor(
        private encounterStudentService: EncounterStudentService,
        private encounterService: EncounterService,
        private notificationsService: NotificationsService,
        private dateTimeConverterService: DateTimeConverterService,
        private therapyCaseNoteService: TherapyCaseNoteService,
        private encounterStudentCptCodesService: EncounterStudentCptCodesService
    ) {}
    
    ngOnInit(): void {
        if (!this.encounterStudent) {
            this.encounterStudent = this.encounterStudentService.getEmptyEncounterStudent();
        }
        this.defaultLocationId = this.locations.find(l => l.Name === 'School').Id;
        forkJoin([this.therapyCaseNoteService.getAll()])
            .subscribe(([notes]) => {
                this.storedTherapyNotes = notes;
            })
    }

    // #region Encounter CRUD
    saveEncounter(): void {
        if (this.validateEncounterDate()) {
            this.encounterStudent.DiagnosisCodeId = this.encounter.DiagnosisCodeId;
            if (this.encounterStudent.Id > 0) {
                this.updateEncounterStudent();
            } else {
                const encounterToUpdate = { ...this.encounter };
                // Band-aid: Convert times to Eastern before saving
                this.encounterStudent.EncounterStartTime = this.dateTimeConverterService.convertToEasternTimezone(this.encounterStudent.EncounterStartTime, this.encounterStudent.EncounterDate);
                this.encounterStudent.EncounterEndTime = this.dateTimeConverterService.convertToEasternTimezone(this.encounterStudent.EncounterEndTime, this.encounterStudent.EncounterDate);
                encounterToUpdate.EncounterDate = this.encounterStudent.EncounterDate;
                encounterToUpdate.EncounterStartTime = this.encounterStudent.EncounterStartTime;
                encounterToUpdate.EncounterEndTime = this.encounterStudent.EncounterEndTime;
                this.encounterService.update(encounterToUpdate).subscribe((ans) => {
                    this.createEncounterStudent();
                });
            }
        }
    }

    createEncounterStudent(): void {
        this.encounterStudent.EncounterLocationId = this.encounterStudent.EncounterLocationId && this.encounterStudent.EncounterLocationId > 0 ? this.encounterStudent.EncounterLocationId : this.defaultLocationId; 
        this.encounterStudentService.createEncounterStudent(this.studentId, this.encounter.Id, this.encounterStudent.EncounterLocationId, this.encounterStudent.StudentDeviationReasonId)
            .subscribe((es) => {
                this.success();
                this.notificationsService.success('Encounter added successfully.');
            });
    }

    updateEncounterStudent(): void {
        if (this.validateEncounterDate()) {
            this.encounterStudent.TherapyCaseNotes = this.notesControl ? this.notesControl.value : '';
            // clear unnecessary metadata on update to prevent provider phone validation error
            this.encounterStudent.Student = null;
            this.encounterStudent.CaseLoad = null;
            this.encounterStudent.Encounter = null;
            // Band-aid: Convert times to Eastern before saving
            this.encounterStudent.EncounterStartTime = this.dateTimeConverterService.convertToEasternTimezone(this.encounterStudent.EncounterStartTime, this.encounterStudent.EncounterDate);
            this.encounterStudent.EncounterEndTime = this.dateTimeConverterService.convertToEasternTimezone(this.encounterStudent.EncounterEndTime, this.encounterStudent.EncounterDate);
            this.encounterStudentService
                .updateEncounterStudent(this.encounterStudent)
                .subscribe(() => {
                    this.success();
                    this.notificationsService.success('Student updated successfully.');
                });
        }
    }
    // #endregion

    closeModal(): void {
        this.closeAddEncounterStudentModal.emit();
    }

    success(): void {
        this.encounterStudentUpdated.emit();
        this.closeModal();
    }

    validateEncounterDate(): boolean {
        const today = new Date();
        const startTime = this.encounterStudent.EncounterStartTime;
        const endTime = this.encounterStudent.EncounterEndTime;
        if (!startTime || !endTime) {
            this.notificationsService.error('Encounter times cannot be empty.');
            return false;
        }
        const startHour = Number.parseInt(startTime.slice(0, 2), null);
        const endHour = Number.parseInt(endTime.slice(0, 2), null);
        const startMinute = Number.parseInt(startTime.slice(3, 5), null);
        const endMinute = Number.parseInt(endTime.slice(3, 5), null);
        const startDateCompare = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            Number.parseInt(startTime.slice(0, 2), null),
            Number.parseInt(startTime.slice(3, 5), null),
        );
        const endDateCompare = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            Number.parseInt(endTime.slice(0, 2), null),
            Number.parseInt(endTime.slice(3, 5), null),
        );
        if ((startHour >= 0 && startHour < 4) || (endHour >= 0 && endHour < 4)) {
            this.notificationsService.error('Encounter times cannot be between 12am and 4am.');
            return false;
        } else if (endDateCompare < startDateCompare) {
            this.notificationsService.error('Encounter start time cannot exceed end time.');
            return false;
        } else if (this.encounterStudent.EncounterStartTime === null || this.encounterStudent.EncounterEndTime === null) {
            this.notificationsService.error('Start time and end time required.');
            return false;
        } else if (this.encounterStudent.EncounterDate === null) {
            this.notificationsService.error('Valid encounter date required.');
            return false;
        } else if (endHour - startHour > 8 || (endHour - startHour >= 8 && endMinute - startMinute > 0)) {
            this.notificationsService.error('Encounter cannot be more than 8 hours long.');
            return false;
        } else if (this.encounter.EncounterDate > today) {
            this.notificationsService.error('Encounter cannot be set in the future.');
            return false;
        } else {
            return true;
        }
    }

    // #region Fields
    getDeviationReasonsField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Deviation Reason',
            name: 'deviationReason',
            labelPosition: new LabelPosition({ 
                position: LabelPositions.Left,
                colsForLabel: 5
            }),
            options: this.deviationReasons,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            } as IDynamicFieldType),
            value: this.encounterStudent?.StudentDeviationReasonId ?? null,
        });
    }

    getLocationsField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Location',
            name: 'location',
            labelPosition: new LabelPosition({ 
                position: LabelPositions.Left,
                colsForLabel: 5
            }),
            options: this.locations,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            } as IDynamicFieldType),
            value: this.encounterStudent?.EncounterLocationId > 0 ? this.encounterStudent.EncounterLocationId : this.defaultLocationId,
            // eslint-disable-next-line @typescript-eslint/unbound-method
            validation: [Validators.required],
            validators: { required: true},
        });
    }

    getIsTelehealthField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Is Telehealth',
            name: 'isTelehealth',
            options: this.locations,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Checkbox,
            } as IDynamicFieldType),
            value: this.encounterStudent?.IsTelehealth ?? false, 
        });
    }

    getDateField(): DynamicField {
        const today = new Date();
        return new DynamicField({
            formGroup: null,
            label: 'Encounter Date',
            name: 'EncounterDate',
            options: null,
            labelPosition: new LabelPosition({ 
                position: LabelPositions.Left,
                colsForLabel: 6
            }),
            type: new DynamicFieldType({
                datepickerOptions: {
                    firstDayOfTheWeek: DaysOfTheWeek.Sunday,
                    maxDate: {
                        day: today.getDate(),
                        month: today.getMonth() + 1,
                        year: today.getFullYear(),
                    },
                },
                dateInputOptions: {
                    maxDate: '9999-01-01'
                },
                fieldType: DynamicFieldTypes.Input,
                inputType: InputTypes.DateInput,
                scale: null,
            }),
            // eslint-disable-next-line @typescript-eslint/unbound-method
            // eslint-disable-next-line @typescript-eslint/unbound-method
            validation: [Validators.required],
            validators: {required: true},
            value: this.encounterStudent?.EncounterDate ?? null,
        });
    }

    getStartTimeField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Encounter Start Time',
            name: 'defaultStartTime',
            labelPosition: new LabelPosition({ 
                position: LabelPositions.Left,
                colsForLabel: 6
            }),
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Input,
                inputType: InputTypes.Timepicker,
                timepickerOptions: {
                    meridian: true,
                    seconds: false,
                    spinners: false,
                },
            } as IDynamicFieldType),
            // eslint-disable-next-line @typescript-eslint/unbound-method
            // eslint-disable-next-line @typescript-eslint/unbound-method
            validation: [Validators.required],
            validators: {required: true},
            value: this.encounterStudent?.EncounterStartTime ?? null,
        });
    }

    getEndTimeField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Encounter End Time',
            name: 'defaultEndTime',
            labelPosition: new LabelPosition({ 
                position: LabelPositions.Left,
                colsForLabel: 6
            }),
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Input,
                inputType: InputTypes.Timepicker,
                timepickerOptions: {
                    meridian: true,
                    seconds: false,
                    spinners: false,
                },
            } as IDynamicFieldType),
            // eslint-disable-next-line @typescript-eslint/unbound-method
            // eslint-disable-next-line @typescript-eslint/unbound-method
            validation: [Validators.required],
            validators: {required: true},
            value: this.encounterStudent?.EncounterEndTime ?? null,
        });
    }

    handleDateSelection(event: Date): void {
        if (event) {
            const today = new Date();
            const date = new Date(event.getUTCFullYear(), event.getUTCMonth(), event.getUTCDate());
            const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
            if (date >= tomorrow) {
                this.notificationsService.error("Encounter date cannot be set in the future.");
            } else {
                this.encounterStudent.EncounterDate = date;
            }
        }
    }
    // #endregion

    // #region Therapy Case Notes
    getStoredNotesControl(): DynamicField {
        const field = new DynamicField({
            disabled: !this.storedTherapyNotes.length,
            formGroup: null,
            label: 'Select Stored Case Notes',
            name: 'StoredCaseNotes',
            options: this.storedTherapyNotes.map((n) => new MetaItem(n.Id, n.Notes)),
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.MultiselectDropdown,
            }),
            value: '',
        });
        return field;
    }

    getCaseNotesField(): DynamicField {
        this.notesField = new DynamicField({
            formGroup: null,
            label: 'Therapy Case Notes',
            name: 'TherapyCaseNotes',
            options: null,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Input,
                inputType: null,
                scale: null,
            }),
            validation: [ Validators.maxLength(6000) ],
            validators: { 'maxlength': 6000 },
            value: this.encounterStudent?.TherapyCaseNotes !== null ? this.encounterStudent.TherapyCaseNotes.toString() : '',
        });
        return this.notesField;
    }

    setNotesValue(selectedNote: Array<number>): void {
        if (selectedNote && selectedNote.length > 0) {
            const selectedNotes: Array<string> = selectedNote.map(id => {
                const note = this.storedTherapyNotes.find(n => n.Id === id);
                return note ? note.Notes : '';
            });
    
            const existingNotesValue: string = this.notesControl.value ? this.notesControl.value.toString() : '';
    
            // Keep the typed words intact
            let typedWords: Array<string> = existingNotesValue.split('\n').filter(note => {
                // Keep only the typed words that are not in selectedNotes
                return !selectedNotes.includes(note);
            });

            // Remove unselected items from typedWords only if they are in storedTherapyNotes and not in selectedNotes
            typedWords = typedWords.filter(word =>
                (!this.storedTherapyNotes.find(note => note.Notes === word) && !selectedNotes.includes(word))
            );
        
            const newNotesValue: string = [...new Set([...typedWords, ...selectedNotes])].join('\n');
 
            this.notesControl.setValue(newNotesValue);
        }
    }

    notesControlCreated(createdControl: AbstractControl): void {
        this.notesControl = createdControl;

        createdControl.setValue(this.encounterStudent.TherapyCaseNotes);
        this.notesControl.updateValueAndValidity();
    }

    typedCaseNotes(typedNotes): void {
        this.notesField.value = typedNotes;
    }

    saveNotes(): void {
        const notes: ITherapyCaseNote = this.therapyCaseNoteService.getEmptyTherapyCaseNote();
        notes.Notes = this.notesControl.value;
        if (notes.Notes && notes.Notes.length && !this.isDuplicateNote(notes.Notes)) {
            this.therapyCaseNoteService
                .create(notes)
                .subscribe(
                    () => {
                        this.storedTherapyNotes.push(notes);
                        this.showNotes = false;
                        setTimeout(() => (this.showNotes = true));
                        this.notificationsService.success('Notes saved successfully');
                    },
                    () => this.notificationsService.error('Notes failed to save.'),
                );
        } else {
            this.notificationsService.error('Notes field must be unique and not blank in order to save.');
        }
    }

    isDuplicateNote(notes: string): boolean {
        return this.storedTherapyNotes.some((note) => note.Notes === notes);
    }
    // #endregion

    formCreated(createdForm: UntypedFormGroup): void {
        this.studentFormForSave = createdForm;
    }

    // #region Field Value Changes
    deviationReasonUpdated(): void {
        if (this.hasDeviationReason) {
            this.encounterStudent.EncounterStatusId = EncounterStatuses.DEVIATED;
        }
        if (this.encounterStudent.Id > 0) {
            this.updateEncounterStudent();
        }
    }

    startTimeUpdated($event: string): void {
        if (this.encounterStudent.EncounterStudentCptCodes?.length === 1 && $event !== this.encounterStudent.EncounterStartTime) {
            const code = this.encounterStudent.EncounterStudentCptCodes[0];
            code.Minutes = this.dateTimeConverterService.getTimeDurationInMins($event, this.encounterStudent.EncounterStartTime);
            if (code.Id > 0) {
                this.encounterStudentCptCodesService.update(code).subscribe();
            }
        }
    }

    endTimeUpdated($event: string): void {
        if (this.encounterStudent.EncounterStudentCptCodes?.length === 1 && $event !== this.encounterStudent.EncounterEndTime) {
            const code = this.encounterStudent.EncounterStudentCptCodes[0];
            code.Minutes = this.dateTimeConverterService.getTimeDurationInMins(this.encounterStudent.EncounterEndTime, $event);
            if (code.Id > 0) {
                this.encounterStudentCptCodesService.update(code).subscribe();
            }
        }
    }
    // #endregion
}