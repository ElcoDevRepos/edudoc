import { DatePipe } from '@angular/common';
import { DeleteEntityCellComponent } from '@common/delete-entity-cell-component/delete-entity-cell.component';
import { IStudentDto } from '@model/interfaces/custom/student.dto';
import { IStudent } from '@model/interfaces/student';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';
import { Observable } from 'rxjs';

export class StudentsEntityListConfig extends EntityListConfig {
    constructor(getDataForExport?: () => Observable<IStudent[]>) {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    accessors: ['Student', 'LastName'],
                    name: 'Last Name',
                }),
                new EntityListColumn({
                    accessors: ['Student', 'FirstName'],
                    name: 'First Name',
                }),
                new EntityListColumn({
                    accessorFunction: function (student: IStudentDto): string {
                        return new Date(new DatePipe('en-Us').transform(student.Student.DateOfBirth, 'yyyy-MM-ddThh:mm:ss', 'UTC')).toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'});
                    },
                    name: 'Date Of Birth',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessors: ['Student', 'StudentCode'],
                    name: 'Student Code',
                }),
                new EntityListColumn({
                    accessors: ['Student', 'Grade'],
                    name: 'Grade',
                }),
                new EntityListColumn({
                    accessors: ['Student', 'School', 'Name'],
                    name: 'School',
                }),
                new EntityListColumn({
                    component: DeleteEntityCellComponent,
                    name: 'Archive',
                    sort: { disableSort: true },
                    style: { width: 50 },
                }),
            ],
            export: {
                exportName: 'students',
                getDataForExport: getDataForExport
            }
        };
        super(listConfig);
    }
}
