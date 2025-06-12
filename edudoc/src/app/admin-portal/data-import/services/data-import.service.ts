import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class DataImportService {
    constructor(private http: HttpClient) {}

    /**
     * Downloads a CSV template for encounter imports
     * Calls the backend API to get the template
     */
    downloadEncounterTemplate(): Observable<ArrayBuffer> {
        return this.http.get(`/data-import/encounters/template`, {
            responseType: 'arraybuffer'
        }).pipe(catchError(err => throwError(() => err)));
    }

    /**
     * Uploads and processes a CSV file for encounter imports
     * @param file The CSV file to upload
     * @param createMissingStudentRecords Whether to create missing student records
     * @returns Observable of the response (either error file or success message)
     */
    importEncounters(file: File, createMissingStudentRecords = false): Observable<Blob> {
        const formData = new FormData();
        formData.append('file', file);
        
        return this.http.post(`/data-import/encounters/import?createMissingStudentRecords=${String(createMissingStudentRecords)}`, formData, {
            responseType: 'blob'
        }).pipe(catchError<Blob, Observable<Blob>>(err => throwError(() => err)));
    }

    /**
     * Converts SNAP files to our import format
     * @param studentFile The CSV file containing student data
     * @param serviceFile The CSV file containing service data
     * @returns Observable of the converted file content
     */
    convertSnapFiles(studentFile: File, serviceFile: File): Observable<ArrayBuffer> {
        const formData = new FormData();
        formData.append('studentFile', studentFile);
        formData.append('serviceFile', serviceFile);
        
        return this.http.post('/data-import/convert?partner=SNAP', formData, {
            responseType: 'arraybuffer'
        }).pipe(catchError(err => throwError(() => err)));
    }

    /**
     * Converts MST files to our import format
     * @param serviceFile The JSON file containing service data
     * @returns Observable of the converted file content
     */
    convertMstFiles(serviceFile: File): Observable<ArrayBuffer> {
        const formData = new FormData();
        formData.append('serviceFile', serviceFile);
        
        return this.http.post('/data-import/convert?partner=MST', formData, {
            responseType: 'arraybuffer'
        }).pipe(catchError(err => throwError(() => err)));
    }
} 