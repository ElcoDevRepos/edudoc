import { IModalOptions } from '@mt-ng2/modal-module';

export const archiveConfirm: IModalOptions = {
    cancelButtonText: 'Cancel',
    confirmButtonText: 'Yes, I am sure!',
    denyButtonText: '',
    icon: 'warning',
    showCancelButton: true,
    showConfirmButton: true,
    showDenyButton: false,
    text: `Are you sure you want to delete this record?`,
    title: 'Delete Record',
};

export const unarchiveConfirm: IModalOptions = {
    cancelButtonText: 'Cancel',
    confirmButtonText: 'Yes, I am sure!',
    denyButtonText: '',
    icon: 'warning',
    showCancelButton: true,
    showConfirmButton: true,
    showDenyButton: false,
    text: `Are you sure you want to restore this record?`,
    title: 'Restore Record',
};
