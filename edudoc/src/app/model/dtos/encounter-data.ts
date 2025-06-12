import { ICptCodeWithMinutesDto } from '@model/interfaces/custom/encounter-response.dto';
import { IGoal } from '@model/interfaces/goal';
import { IMethod } from '@model/interfaces/method';

export type IBasicEncounterLineData = {
    Kind: 'basic';
    EncounterNumber: string;
    EncounterDate: string;
    ServiceType: string;
    Status: string;
    Grouping: number;
    AdditionalStudents: number;
    StartTime: string;
    EndTime: string;
    TotalMinutes: number;
    IsTelehealth: boolean;
};

export type IDetailedEncounterLineData = Omit<IBasicEncounterLineData, 'Kind'> & {
    Kind: 'detailed';
    ReasonForService: string;
    ReasonForDeviation: string;
    Methods: IMethod[];
    Goals: IGoal[];
    ProcedureCodes: ICptCodeWithMinutesDto[];
    Notes: string;
    EntryDate: string;
};

export type IEncounterLineData = IBasicEncounterLineData | IDetailedEncounterLineData;

export type EncounterType = IEncounterLineData['Kind'];

export type IEncounterDistrictData<T extends IEncounterLineData> = {
    DistrictName: string;
    GroupData: IEncounterGroupData<T>[];
};
export type IBasicEncounterDistrictData = IEncounterDistrictData<IBasicEncounterLineData>;
export type IDetailedEncounterDistrictData = IEncounterDistrictData<IDetailedEncounterLineData>;

export type IEncounterGroupData<T extends IEncounterLineData> = {
    ProviderName: string;
    StudentInfo: string;
    IEPStartDate: string;
    TotalMinutes: number;
    LineData: T[];
};

export type IEncounterFullData<T extends IEncounterLineData> = {
	GroupData: Omit<IEncounterGroupData<T>, 'LineData'>,
    DistrictData: Omit<IEncounterDistrictData<T>, 'GroupData'>,
    LineData: T;
}

export type IBasicEncounterFullData = IEncounterFullData<IBasicEncounterLineData>;
export type IDetailedEncounterFullData = IEncounterFullData<IDetailedEncounterLineData>;

