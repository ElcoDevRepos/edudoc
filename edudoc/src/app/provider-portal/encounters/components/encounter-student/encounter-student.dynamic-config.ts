import { IDynamicConfig, IDynamicFormConfig, DynamicConfig } from '@mt-ng2/dynamic-form';

import { IEncounterStudent } from '@model/interfaces/encounter-student';
import { IEncounterStudentDynamicControlsParameters } from '@model/form-controls/encounter-student.form-controls';
import { IStudentDeviationReason } from '@model/interfaces/student-deviation-reason';
import { EncounterStudentDynamicControlsPartial } from '@model/partials/encounter-student-partial.form-controls';
import { IEncounterStatus } from '@model/interfaces/encounter-status';
import { IEncounterLocation } from '@model/interfaces/encounter-location';
import { DateTimeConverterService } from '@common/services/date-time-converter.service';
import { IMetaItem } from '@mt-ng2/base-service';
import { IDocumentType } from '@model/interfaces/document-type';

export class EncounterStudentDynamicConfig<T extends IEncounterStudent> extends DynamicConfig<T> implements IDynamicConfig<T> {
    constructor(
        private dateTimeConverter: DateTimeConverterService,
        private encounterStudent: T,
        private studentDeviationReasons: IStudentDeviationReason[],
        private encounterLocations: IEncounterLocation[],
        private encounterStatuses: IEncounterStatus[],
        private reasonForServiceOptions?: IMetaItem[],
        private documentTypes?: IDocumentType[],
        private configControls?: string[],
        providerName?: string,
        serviceTypeId?: number,
        startTime?: string,
        endTime?: string,
        caseNotesRequired?: boolean,
    ) {
        super();
        const additionalParams: IEncounterStudentDynamicControlsParameters = {
            createdBies: null,
            documentTypes: this.documentTypes,
            encounterLocations: this.encounterLocations,
            encounterStatuses: this.encounterStatuses,
            modifiedBies: null,
            studentDeviationReasons: this.studentDeviationReasons,
        };
        const dynamicControls = new EncounterStudentDynamicControlsPartial(
            this.dateTimeConverter,
            this.encounterStudent,
            additionalParams,
            providerName,
            studentDeviationReasons,
            encounterLocations,
            reasonForServiceOptions,
            serviceTypeId,
            startTime,
            endTime,
            caseNotesRequired,
        );
        // default form implementation can be overridden at the component level
        if (!configControls) {
            this.configControls = [
                'ReasonForReturn',
                'EncounterStartTime',
                'EncounterEndTime',
                'StudentDeviationReasonId',
                'EncounterLocationId',
                'IsTelehealth',
                'TherapyCaseNotes',
                'DocumentTypeId',
            ];
        }
        this.setControls(this.configControls, dynamicControls);
    }

    getForUpdate(additionalConfigs?: any[]): IDynamicFormConfig {
        return {
            formObject: this.getFormObject(additionalConfigs),
            viewOnly: this.DynamicLabels,
        };
    }

    getForCreate(additionalConfigs?: any[]): IDynamicFormConfig {
        return {
            formObject: this.getFormObject(additionalConfigs),
        };
    }
}
