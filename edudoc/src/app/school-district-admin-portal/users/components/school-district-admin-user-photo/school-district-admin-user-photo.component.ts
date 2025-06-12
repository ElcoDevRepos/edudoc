import { Component, Input, OnInit } from '@angular/core';
import { environment } from '@common/environments/environment';
import { IUser } from '@model/interfaces/user';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { SchoolDistrictAdminUserService } from '@school-district-admin/users/services/school-district-admin-user.service';

@Component({
    selector: 'app-school-district-admin-user-photo',
    templateUrl: './school-district-admin-user-photo.component.html',
})
export class SchoolDistrictAdminUserPhotoComponent implements OnInit {
    @Input() user: IUser;
    @Input() canEdit: boolean;

    isEditing: boolean;
    errorMessage: string;
    imagePath: string;
    croppedFile: File;

    constructor(private notificationsService: NotificationsService, private userService: SchoolDistrictAdminUserService) {}

    ngOnInit(): void {
        this.imagePath = environment.imgPath;
        this.isEditing = false;
    }

    edit(): void {
        if (this.canEdit) {
            this.isEditing = true;
        }
    }

    afterFileCropped(croppedFile: File): void {
        this.croppedFile = croppedFile;
    }

    savePhoto(): void {
        if (this.croppedFile) {
            this.userService.savePhoto(this.user.Id, this.croppedFile).subscribe((answer) => {
                this.user.Image = answer.Image;
                this.user.Version = answer.Version;
                this.isEditing = false;
                this.notificationsService.success('User Photo Saved Successfully');
            });
        }
    }

    deletePhoto(): void {
        this.userService.deletePhoto(this.user.Id).subscribe(() => {
            this.user.Image = null;
            this.isEditing = false;
            this.notificationsService.success('User Photo Deleted Successfully');
        });
    }
}
