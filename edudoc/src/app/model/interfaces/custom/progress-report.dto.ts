import { IEntity } from '@mt-ng2/base-service';
import { IProgressReport } from '../progress-report';
import { IDistrictProgressReportDate } from '../district-progress-report-date';
import { QuarterEnum } from '@model/enums/progress-report-quarters.enum';

export interface IProgressReportDto extends IEntity {
    Id: number;
    StudentId: number;
    FirstName: string;
    LastName: string;
    DateRanges: IDistrictProgressReportDate;
    FirstQuarterProgressReports: IProgressReport[];
    SecondQuarterProgressReports: IProgressReport[];
    ThirdQuarterProgressReports: IProgressReport[];
    FourthQuarterProgressReports: IProgressReport[];
    PreviousProgressReports: IProgressReport[];
    ProgressReports: IProgressReport[];
    Quarters: number[];
    SupervisorId: number;
}


export interface IProgressReportDtoWithHelpers extends IProgressReportDto {
    UnnecessaryQuarters: {[Q in QuarterEnum]: boolean},
    CompletedQuarters: {[Q in QuarterEnum]: boolean},
}
