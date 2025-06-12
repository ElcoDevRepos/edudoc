import { SchoolDistrictService } from '@admin/school-districts/services/schooldistrict.service';
import { Component } from '@angular/core';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { IEntity, IEntityListComponentMembers, IEntityListDynamicCellComponent } from '@mt-ng2/entity-list-module';
import { NotificationsService } from '@mt-ng2/notifications-module';

@Component({
    styles: [],
    templateUrl: './school-district-active-status-cell.component.html',
})

export class SchoolDistrictActiveStatusDynamicCellComponent implements IEntityListDynamicCellComponent {
    entityListComponentMembers: IEntityListComponentMembers;
    set entity(value: IEntity) {
        this.district = value as ISchoolDistrict;
    }
    district: ISchoolDistrict;
    get isActiveStatus(): boolean {
        return this.district.ActiveStatus;
    }

    constructor(
        private schoolDistrictService: SchoolDistrictService,
        private notificationsService: NotificationsService,
    ) {}

    buttonClicked(event: Event): void {
        event.stopPropagation();
        this.district.ActiveStatus = !this.isActiveStatus;
        this.schoolDistrictService.update(this.district).subscribe(() => {
            this.notificationsService.success('School district status successfully updated');
        });
    }
}
