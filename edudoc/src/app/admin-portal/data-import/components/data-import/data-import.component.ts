import { Component, ViewChild, ElementRef } from '@angular/core';
import { DataImportService } from '../../services/data-import.service';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-data-import',
    templateUrl: './data-import.component.html',
    styleUrls: ['./data-import.component.scss']
})
export class DataImportComponent {
    @ViewChild('fileInput') fileInput!: ElementRef;
    isDownloading = false;
    isUploading = false;
    isConverting = false;
    selectedFile: File | null = null;
    errorMessage: string | null = null;
    successMessage: string | null = null;
    createMissingStudentRecords = false;

    // New properties for conversion
    selectedPartner = '';
    snapStudentFile: File | null = null;
    snapServiceFile: File | null = null;
    mstServiceFile: File | null = null;
    
    get canConvert(): boolean {
        if (this.selectedPartner === 'SNAP') {
            return !!(this.snapStudentFile && this.snapServiceFile);
        } else if (this.selectedPartner === 'MST') {
            return !!this.mstServiceFile;
        }
        return false;
    }
    
    constructor(private dataImportService: DataImportService) {}
    
    downloadTemplate(): void {
        this.isDownloading = true;
        this.errorMessage = null;
        
        this.dataImportService.downloadEncounterTemplate().subscribe({
            next: (response) => {
                const blob = new Blob([response], { type: 'text/csv' });
                saveAs(blob, 'encounter_import_template.csv');
                this.isDownloading = false;
            },
            error: (error) => {
                console.error('Error downloading template:', error);
                this.isDownloading = false;
                this.errorMessage = 'Failed to download template. Please try again later.';
                
                if (error.status === 401 || error.status === 403) {
                    this.errorMessage = 'You do not have permission to download this template.';
                } else if (error.status === 404) {
                    this.errorMessage = 'Template not found.';
                } else if (error.status === 500) {
                    this.errorMessage = 'Server error occurred. Please contact support.';
                }
            }
        });
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            this.selectedFile = input.files[0];
            this.errorMessage = null;
            this.successMessage = null;
        }
    }

    uploadFile(): void {
        if (!this.selectedFile) {
            this.errorMessage = 'Please select a file to upload';
            return;
        }

        this.isUploading = true;
        this.errorMessage = null;
        this.successMessage = null;

        this.dataImportService.importEncounters(this.selectedFile, this.createMissingStudentRecords).subscribe({
            next: (response: Blob) => {
                this.isUploading = false;
                
                // Check if the response is an error file (CSV)
                if (response.type === 'text/csv') {
                    const blob = new Blob([response], { type: 'text/csv' });
                    const fileName = `${this.selectedFile?.name.replace('.csv', '')}_errors_${new Date().toISOString().slice(0,19).replace(/[:]/g, '')}.csv`;
                    saveAs(blob, fileName);
                    this.errorMessage = 'Import completed with errors. Please check the error file.';
                } else {
                    // Handle success response
                    this.successMessage = 'File imported successfully!';
                }
                this.resetFileInput();
            },
            error: (error) => {
                this.isUploading = false;
                this.errorMessage = 'Error uploading file. Please try again.';
                
                if (error.status === 400) {
                    this.errorMessage = 'Invalid file format. Only CSV files are allowed.';
                } else if (error.status === 401 || error.status === 403) {
                    this.errorMessage = 'You do not have permission to upload files.';
                } else if (error.status === 500) {
                    this.errorMessage = 'Server error occurred. Please contact support.';
                }
            }
        });
    }

    resetFileInput(): void {
        this.selectedFile = null;
        if (this.fileInput) {
            this.fileInput.nativeElement.value = '';
        }
    }

    onPartnerChange(): void {
        // Reset files when partner changes
        this.snapStudentFile = null;
        this.snapServiceFile = null;
        this.mstServiceFile = null;
        this.errorMessage = null;
        this.successMessage = null;
    }

    onSnapFileSelected(event: Event, fileType: 'students' | 'services'): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            if (fileType === 'students') {
                this.snapStudentFile = input.files[0];
            } else {
                this.snapServiceFile = input.files[0];
            }
            this.errorMessage = null;
            this.successMessage = null;
        }
    }

    onMstFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            this.mstServiceFile = input.files[0];
            this.errorMessage = null;
            this.successMessage = null;
        }
    }

    convertFiles(): void {
        if (!this.canConvert) {
            this.errorMessage = 'Please select all required files before converting';
            return;
        }

        this.isConverting = true;
        this.errorMessage = null;
        this.successMessage = null;

        if (this.selectedPartner === 'SNAP') {
            this.dataImportService.convertSnapFiles(this.snapStudentFile, this.snapServiceFile).subscribe({
                next: (response: ArrayBuffer) => {
                    this.isConverting = false;
                    // Handle successful conversion - maybe auto-download the converted file
                    const blob = new Blob([response], { type: 'text/csv' });
                    saveAs(blob, 'converted_encounters.csv');
                    this.successMessage = 'Files converted successfully!';
                },
                error: (error) => {
                    this.isConverting = false;
                    this.errorMessage = 'Error converting files. Please try again.';
                    
                    if (error.status === 400) {
                        this.errorMessage = 'Invalid file format. Please check your files and try again.';
                    } else if (error.status === 500) {
                        this.errorMessage = 'Server error occurred. Please contact support.';
                    }
                }
            });
        } else if (this.selectedPartner === 'MST') {
            this.dataImportService.convertMstFiles(this.mstServiceFile).subscribe({
                next: (response: ArrayBuffer) => {
                    this.isConverting = false;
                    // Handle successful conversion - maybe auto-download the converted file
                    const blob = new Blob([response], { type: 'text/csv' });
                    saveAs(blob, 'converted_encounters.csv');
                    this.successMessage = 'Files converted successfully!';
                },
                error: (error) => {
                    this.isConverting = false;
                    this.errorMessage = 'Error converting files. Please try again.';
                    
                    if (error.status === 400) {
                        this.errorMessage = 'Invalid file format. Please check your files and try again.';
                    } else if (error.status === 500) {
                        this.errorMessage = 'Server error occurred. Please contact support.';
                    }
                }
            });
        }
    }
} 