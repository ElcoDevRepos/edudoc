import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@common/shared.module';
import { HttpClientModule } from '@angular/common/http';

import { DataImportComponent } from './components/data-import/data-import.component';
import { DataImportService } from './services/data-import.service';

@NgModule({
    declarations: [
        DataImportComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        HttpClientModule
    ],
    providers: [
        DataImportService
    ]
})
export class DataImportModule { } 