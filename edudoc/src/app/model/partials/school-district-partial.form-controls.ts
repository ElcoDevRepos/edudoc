import { Validators } from '@angular/forms';
import { GetDigitsExactLengthValidator } from '@common/validators/digits-exact-length.validator';
import { IMetaItem, MetaItem } from '@mt-ng2/base-service';
import { DynamicField, DynamicFieldTypes, DynamicLabel, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { DAYS_OF_WEEK } from 'angular-calendar';
import { ISchoolDistrictDynamicControlsParameters, SchoolDistrictDynamicControls } from '../form-controls/school-district.form-controls';
import { ISchoolDistrict } from '../interfaces/school-district';
import { NumberValidations } from './number-validation-lengths.validation';

export class SchoolDistrictDynamicControlsPartial extends SchoolDistrictDynamicControls {
    constructor(
        schooldistrictPartial?: ISchoolDistrict,
        accountAssistants?: IMetaItem[],
        accountManagers?: IMetaItem[],
        treasurers?: IMetaItem[],
        additionalParameters?: ISchoolDistrictDynamicControlsParameters,
    ) {
        super(schooldistrictPartial, additionalParameters);

        // Progress reports
        (<DynamicField>this.Form.ProgressReports).type.fieldType = DynamicFieldTypes.Select;
        (<DynamicField>this.Form.ProgressReports).type.inputType = SelectInputTypes.RadioButtonList;
        (<DynamicField>this.Form.ProgressReports).options = [new MetaItem(1, 'Yes'), new MetaItem(0, 'No')];
        (<DynamicField>this.Form.ProgressReports).value = schooldistrictPartial.ProgressReports ? 1 : 0;
        (<DynamicField>this.Form.ProgressReports).labelHtml = '<h4>District Operation Details</h4><label>Use Progress Reports</label>';

        // Require notes for all encounter
        (<DynamicField>this.Form.RequireNotesForAllEncountersSent).labelHtml = '<label>Requires Case Notes for Encounters</label>';
        (<DynamicField>this.View.RequireNotesForAllEncountersSent).label = 'Requires Case Notes for Encounters';
        (<DynamicField>this.Form.RequireNotesForAllEncountersSent).type.fieldType = DynamicFieldTypes.Select;
        (<DynamicField>this.Form.RequireNotesForAllEncountersSent).type.inputType = SelectInputTypes.RadioButtonList;
        (<DynamicField>this.Form.RequireNotesForAllEncountersSent).options = [new MetaItem(1, 'Yes'), new MetaItem(0, 'No')];
        (<DynamicField>this.Form.RequireNotesForAllEncountersSent).value = schooldistrictPartial.RequireNotesForAllEncountersSent ? 1 : 0;

        // Use disability Code managed List
        (<DynamicField>this.Form.UseDisabilityCodes).labelHtml = '<label>Disability Code Utilized</label>';
        (<DynamicField>this.View.UseDisabilityCodes).label = 'Disability Code Utilized';
        (<DynamicField>this.Form.UseDisabilityCodes).type.fieldType = DynamicFieldTypes.Select;
        (<DynamicField>this.Form.UseDisabilityCodes).type.inputType = SelectInputTypes.RadioButtonList;
        (<DynamicField>this.Form.UseDisabilityCodes).options = [new MetaItem(1, 'Yes'), new MetaItem(0, 'No')];
        (<DynamicField>this.Form.UseDisabilityCodes).value = schooldistrictPartial.UseDisabilityCodes ? 1 : 0;

        (<DynamicField>(
            this.Form.EinNumber
        )).labelHtml = `<label>EIN Number</label> <em>(Must be exactly ${NumberValidations.EIN} digits with no spaces)</em>`;
        (<DynamicField>(
            this.Form.IrnNumber
        )).labelHtml = `<label>IRN Number</label> <em>(Must be exactly ${NumberValidations.IRN} digits with no spaces)</em>`;
        (<DynamicField>(
            this.Form.NpiNumber
        )).labelHtml = `<label>NPI Number</label> <em>(Must be exactly ${NumberValidations.NPI} digits with no spaces)</em>`;
        (<DynamicField>(
            this.Form.ProviderNumber
        )).labelHtml = `<label>Provider Number</label> <em>(Must be exactly ${NumberValidations.Provider} digits with no spaces)</em>`;
        (<DynamicLabel>this.View.EinNumber).label = 'EIN Number';
        (<DynamicLabel>this.View.IrnNumber).label = 'IRN Number';
        (<DynamicLabel>this.View.NpiNumber).label = 'NPI Number';

        (<DynamicField>this.Form.EinNumber).validation = [GetDigitsExactLengthValidator(NumberValidations.EIN)];
        (<DynamicField>this.Form.IrnNumber).validation = [GetDigitsExactLengthValidator(NumberValidations.IRN)];
        (<DynamicField>this.Form.NpiNumber).validation = [GetDigitsExactLengthValidator(NumberValidations.NPI)];
        (<DynamicField>this.Form.ProviderNumber).validation = [GetDigitsExactLengthValidator(NumberValidations.Provider)];

        (<DynamicField>this.Form.NotesRequiredDate).disabled = !schooldistrictPartial.RequireNotesForAllEncountersSent;
        (<DynamicField>this.Form.NotesRequiredDate).validation = schooldistrictPartial.RequireNotesForAllEncountersSent ? [Validators.required] : [];
        (<DynamicField>this.Form.NotesRequiredDate).validators = schooldistrictPartial.RequireNotesForAllEncountersSent ? { required: true } : {};

        (<DynamicField>this.Form.AccountAssistantId).type.fieldType = DynamicFieldTypes.Select;
        (<DynamicField>this.Form.AccountAssistantId).type.inputType = SelectInputTypes.Dropdown;
        (<DynamicField>this.Form.AccountAssistantId).options = accountAssistants;
        (<DynamicField>this.Form.AccountAssistantId).disabled = !accountAssistants.length;
        (<DynamicField>this.View.AccountAssistantId).value = schooldistrictPartial.AccountAssistant
            ? `${schooldistrictPartial.AccountAssistant.LastName}, ${schooldistrictPartial.AccountAssistant.FirstName}`
            : 'None Selected';

        (<DynamicField>this.Form.AccountManagerId).labelHtml = '<label>HPC Account Manager</label>';
        (<DynamicField>this.View.AccountManagerId).label = 'HPC Account Manager';
        (<DynamicField>this.Form.AccountManagerId).type.fieldType = DynamicFieldTypes.Select;
        (<DynamicField>this.Form.AccountManagerId).type.inputType = SelectInputTypes.Dropdown;
        (<DynamicField>this.Form.AccountManagerId).options = accountManagers;
        (<DynamicField>this.Form.AccountManagerId).disabled = !accountManagers.length;
        (<DynamicField>this.View.AccountManagerId).value = schooldistrictPartial.AccountManager
            ? `${schooldistrictPartial.AccountManager.LastName}, ${schooldistrictPartial.AccountManager.FirstName}`
            : 'None Selected';

        (<DynamicField>this.Form.TreasurerId).type.fieldType = DynamicFieldTypes.Select;
        (<DynamicField>this.Form.TreasurerId).type.inputType = SelectInputTypes.Dropdown;
        (<DynamicField>this.Form.TreasurerId).options = treasurers;
        (<DynamicField>this.Form.TreasurerId).disabled = !treasurers.length;
        (<DynamicField>this.View.TreasurerId).value = schooldistrictPartial.Treasurer
            ? `${schooldistrictPartial.Treasurer.LastName}, ${schooldistrictPartial.Treasurer.FirstName}`
            : 'None Selected';
        (<DynamicField>this.View.SpecialEducationDirectorId).value = schooldistrictPartial.SpecialEducationDirector
            ? `${schooldistrictPartial.SpecialEducationDirector.LastName}, ${schooldistrictPartial.SpecialEducationDirector.FirstName}`
            : 'None Selected';
        delete this.Form.SpecialEducationDirectorId;

        // District Notes
        (<DynamicField>this.Form.Notes).labelHtml = '<label>District Notes</label>';
        (<DynamicField>this.View.Notes).label = 'District Notes';

        (<DynamicField>this.Form.BecameClientDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY };
        (<DynamicField>this.Form.BecameTradingPartnerDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY };
        (<DynamicField>this.Form.NotesRequiredDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY };
        (<DynamicField>this.Form.ProgressReportsSent).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY };
        (<DynamicField>this.Form.RevalidationDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY };
        (<DynamicField>this.Form.ValidationExpirationDate).type.datepickerOptions = { firstDayOfTheWeek: DAYS_OF_WEEK.SUNDAY };

        this.View.IepDatesRequired.label = 'IEP Dates Required';
        this.View.IepDatesRequired.labelHtml = '<b>IEP Dates Required</b>';

        // We only use these for viewing; we implement the field ourselves
        delete this.Form.CaseNotesRequired;
        delete this.Form.IepDatesRequired;
        delete this.Form.HasProgressReportDate;
    }
}
