import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxMaskModule } from 'ngx-mask';
import { BackButtonModule, IBackButtonModuleConfig, BackButtonModuleConfigToken } from '@mt-ng2/back-button-module';
import { MtDateModule } from '@mt-ng2/date-module';
import { MtDisableDuringHttpCallsModule  } from '@mt-ng2/disable-during-http-calls';
import { MtDocumentControlModule } from '@mt-ng2/document-control';
import { EntityComponentsAddressesModule, EntityComponentsAddressesModuleConfigToken } from '@mt-ng2/entity-components-addresses';
import { EntityComponentsNotesModule } from '@mt-ng2/entity-components-notes';
import { EntityComponentsPhonesModule } from '@mt-ng2/entity-components-phones';
import { EntityListModule, EntityListModuleConfigToken } from '@mt-ng2/entity-list-module';
import { MtFabSpeedDialControlModule } from '@mt-ng2/fab-speed-dial-control';
import { MtManagedListControlModule } from '@mt-ng2/managed-list-control';
import { MtNoteControlModule } from '@mt-ng2/note-control';
import { MtSearchFilterCheckboxModule } from '@mt-ng2/search-filter-checkbox-control';
import { MtSearchFilterDaterangeModule } from '@mt-ng2/search-filter-daterange-control';
import { MtSearchFilterSelectModule } from '@mt-ng2/search-filter-select-control';
import { MtSearchBarControlModule } from '@mt-ng2/searchbar-control';
import { SharedEntitiesModule } from '@mt-ng2/shared-entities-module';

import { KeyboardShortcutModule, KeyboardShortcutService } from '@mt-ng2/keyboard-shortcuts-module';
import { TypeAheadModule } from '@mt-ng2/type-ahead-control';
import { CommonService } from './services/common.service';

import { MtPhotoControlModule } from '@mt-ng2/photo-control';

import { AuditLogModule, AuditLoggingModuleConfigToken } from '@mt-ng2/audit-logging-module';
import { auditLogModuleConfig } from './configs/audit-log.config';
import { DynamicFormModule, DynamicFormModuleConfigToken } from '@mt-ng2/dynamic-form';
import { EntityComponentsDocumentsModule } from '@mt-ng2/entity-components-documents';
import { ModalModule } from '@mt-ng2/modal-module';
import { MultiselectControlModule } from '@mt-ng2/multiselect-control';

import { WysiwygModule } from '@mt-ng2/wysiwyg-control';
import { MaterialModule } from '../material.module';
import { AuthEntityModule } from './auth-entity/auth-entity.module';
import { AuthEntityService } from './auth-entity/auth-entity.service';
import { CompletedActivityReportComponent } from './completed-activity-report/completed-activity-report.component';
import { entityComponentsAddressesModuleConfig } from './configs/entity-address.config';
import { DeleteEntityCellComponent } from './delete-entity-cell-component/delete-entity-cell.component';
import { AupAuditComponent } from './encounter-aup-audit/aup-audit/aup-audit.component';
import { EncounterAupAuditComponent } from './encounter-aup-audit/encounter-aup-audit.component';
import { EncounterReportsComponent } from './encounter-reports/encounter-reports.component';
import { entityListModuleConfig } from './entity-list-module-config';
import { AddressWithCountyComponent } from './extended-breckenridge-components/entity-components-addresses-with-county/address-with-county.component';
import { CommonAddressesWithCountyComponent } from './extended-breckenridge-components/entity-components-addresses-with-county/common-addresses-with-county.component';
import { MerDocumentsComponent } from './extended-breckenridge-components/overridden-documents/mer-documents.component';
import { OverriddenCommonDocumentsComponent } from './extended-breckenridge-components/overridden-documents/overridden-documents.component';
import { ProviderCaseUploadDocumentsComponent } from './extended-breckenridge-components/overridden-documents/provider-case-upload-documents.component';
import { FiscalRevenueReportComponent } from './fiscal-revenue-report/fiscal-revenue-report.component';
import { FiscalSummaryReportComponent } from './fiscal-summary-report/fiscal-summary-report.component';
import { HeaderComponent } from './header/header.component';
import { MiniDashboardListComponent } from './mini-dashboard-list/mini-dashboard-list.component';
import { MultiselectTableControlComponent } from './multi-select-table-control/multiselect-table-control.component';
import { SafePipe } from './safe-pipe';
import { SchoolDistrictAdminComponent } from './school-district-admin/school-district-admin.component';
import { SchoolDistrictEscComponent } from './school-district-esc/school-district-esc.component';
import { MessageFilterTypeService } from './services/message-filter-type.service';
import { StudentParentalConsentsDistrictComponent } from './student-parental-consents-list/student-parental-consents-district/student-parental-consents-district.component';
import { StudentParentalConsentsComponent } from './student-parental-consents-list/student-parental-consents.component';
import { ValidationModalComponent } from './validators/validation-modal/validation-modal.component';
import { StudentMissingAddressesComponent } from '../common/students-missing-addresses/students-missing-addresses.component';
import {FileUploaderComponent} from './file-uploader/file-uploader.component';
import { NavModule } from '@mt-ng2/nav-module';
import { DocumentLinksWidgetComponent } from '@common/documents-links-widget/documents-links-widget.component';
import {NgxExtendedPdfViewerModule} from 'ngx-extended-pdf-viewer'

export const backButtonModuleConfig: IBackButtonModuleConfig = {
    hasKeyboardShortcutsModule: true,
};

export { entityListModuleConfig };

@NgModule({
    declarations: [
        DeleteEntityCellComponent,
        CommonAddressesWithCountyComponent,
        AddressWithCountyComponent,
        MultiselectTableControlComponent,
        SchoolDistrictEscComponent,
        SchoolDistrictAdminComponent,
        EncounterReportsComponent,
        CompletedActivityReportComponent,
        FiscalRevenueReportComponent,
        FiscalSummaryReportComponent,
        StudentParentalConsentsComponent,
        StudentParentalConsentsDistrictComponent,
        StudentMissingAddressesComponent,
        OverriddenCommonDocumentsComponent,
        MerDocumentsComponent,
        MiniDashboardListComponent,
        SafePipe,
        ValidationModalComponent,
        HeaderComponent,
        ProviderCaseUploadDocumentsComponent,
        EncounterAupAuditComponent,
        AupAuditComponent,
        FileUploaderComponent,
        DocumentLinksWidgetComponent
    ],
    exports: [
    CommonModule,
    MaterialModule,
    AuthEntityModule,
    WysiwygModule,
    NgbModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicFormModule,
    NgxMaskModule,
    MtNoteControlModule,
    EntityComponentsNotesModule,
    MtManagedListControlModule,
    MtDocumentControlModule,
    EntityComponentsDocumentsModule,
    EntityComponentsPhonesModule,
    MtSearchFilterSelectModule,
    MtSearchFilterDaterangeModule,
    SchoolDistrictEscComponent,
    SchoolDistrictAdminComponent,
    EncounterReportsComponent,
    CompletedActivityReportComponent,
    FiscalRevenueReportComponent,
    FiscalSummaryReportComponent,
    StudentParentalConsentsComponent,
    StudentMissingAddressesComponent,
    MtDisableDuringHttpCallsModule,
    EntityListModule,
    ModalModule,
    MtSearchBarControlModule,
    SharedEntitiesModule,
    CommonAddressesWithCountyComponent,
    AddressWithCountyComponent,
    EntityComponentsAddressesModule,
    MtSearchFilterCheckboxModule,
    BackButtonModule,
    MtDateModule,
    MtFabSpeedDialControlModule,
    TypeAheadModule,
    KeyboardShortcutModule,
    MtPhotoControlModule,
    AuditLogModule,
    OverriddenCommonDocumentsComponent,
    MerDocumentsComponent,
    MultiselectTableControlComponent,
    MultiselectControlModule,
    MiniDashboardListComponent,
    SafePipe,
    ModalModule,
    HeaderComponent,
    ProviderCaseUploadDocumentsComponent,
    FileUploaderComponent,
    NavModule,
    DocumentLinksWidgetComponent,
    NgxExtendedPdfViewerModule
],
    imports: [
    CommonModule,
    MaterialModule,
    WysiwygModule,
    AuthEntityModule,
    NgbModule,
    RouterModule,
    ModalModule,
    FormsModule,
    DynamicFormModule,
    NgxMaskModule,
    FileUploadModule,
    MtNoteControlModule,
    EntityComponentsNotesModule,
    MtManagedListControlModule,
    EntityComponentsAddressesModule,
    ModalModule,
    AuditLogModule,
    MtDocumentControlModule,
    EntityComponentsDocumentsModule,
    EntityComponentsPhonesModule,
    MtSearchFilterSelectModule,
    MtSearchFilterDaterangeModule,
    MtDisableDuringHttpCallsModule,
    EntityListModule,
    MtSearchBarControlModule,
    SharedEntitiesModule,
    MtSearchFilterCheckboxModule,
    BackButtonModule,
    MtDateModule,
    MtFabSpeedDialControlModule,
    TypeAheadModule,
    KeyboardShortcutModule,
    MtPhotoControlModule,
    MultiselectControlModule,
    MtDisableDuringHttpCallsModule,
    NavModule,
    NgxExtendedPdfViewerModule

]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders<SharedModule> {
        return {
            ngModule: SharedModule,
            providers: [
                AuthEntityService,
                KeyboardShortcutService,
                MessageFilterTypeService,
                SafePipe,
                { provide: DynamicFormModuleConfigToken, useValue: { commonService: CommonService } },
                { provide: BackButtonModuleConfigToken, useValue: backButtonModuleConfig },
                { provide: AuditLoggingModuleConfigToken, useValue: auditLogModuleConfig },
                { provide: EntityComponentsAddressesModuleConfigToken, useValue: entityComponentsAddressesModuleConfig },
                { provide: EntityListModuleConfigToken, useValue: entityListModuleConfig },
            ],
        };
    }
}
