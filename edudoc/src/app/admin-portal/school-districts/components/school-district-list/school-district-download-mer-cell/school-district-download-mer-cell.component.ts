import { Component } from '@angular/core';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { IEntity, IEntityListComponentMembers, IEntityListDynamicCellComponent } from '@mt-ng2/entity-list-module';
import { MerService } from '@school-district-admin/school-districts/services/mer.service';
import { saveAs } from 'file-saver';

@Component({
    styles: [],
    templateUrl: './school-district-download-mer-cell.component.html',
})

export class SchoolDistrictDownloadMerDynamicCellComponent implements IEntityListDynamicCellComponent {
    entityListComponentMembers: IEntityListComponentMembers;
    set entity(value: IEntity) {
        this.district = value as ISchoolDistrict;
    }
    district: ISchoolDistrict;
    get hasMer(): boolean {
        return this.district.MerId ? true : false;
    }

    constructor(
        private merService: MerService,
    ) {}

    buttonClicked(event: Event): void {
        event.stopPropagation();
        this.merService.getDocument(this.district.Id, this.district.MerId).subscribe((resultBlob: Blob) => {
            const fileContents = new Blob([resultBlob], {
                type: 'application/octet-stream',
            });
            saveAs(fileContents, `${this.district.Name}_MER.txt`);
        });
    }
}
