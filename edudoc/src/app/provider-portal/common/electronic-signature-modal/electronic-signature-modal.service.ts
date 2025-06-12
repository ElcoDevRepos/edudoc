import { ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, EventEmitter, Injectable, Injector } from '@angular/core';
import { SharedModule } from '@common/shared.module';
import { IESignatureContent } from '@model/interfaces/e-signature-content';
import { take } from 'rxjs/operators';
import { ElectronicSignatureModalComponent } from './electronic-signature-modal.component';

export interface IMergeField {
    target: string;
    value: string;
}

@Injectable({
    providedIn: SharedModule,
})
export class ElectronicSignatureModalService {
    private _componentRef: ComponentRef<ElectronicSignatureModalComponent>;
    private _dateFields = false;

    saved: EventEmitter<Date> = new EventEmitter<Date>();
    cancelled: EventEmitter<void> = new EventEmitter<void>();

    constructor(private componentFactoryResolver: ComponentFactoryResolver, private appRef: ApplicationRef, private injector: Injector) {}

    showModal(signatureContent: IESignatureContent, mergeFields: IMergeField[]): void {
        this.destroyComponent();

        this._componentRef = this.componentFactoryResolver.resolveComponentFactory(ElectronicSignatureModalComponent).create(this.injector);
        this._componentRef.instance.showDateControl = this._dateFields;
        this._componentRef.instance.signatureContent = this.applyMergeFields(signatureContent, mergeFields);
        this._componentRef.instance.onSign.pipe(take(1)).subscribe((effectiveDate) => {
            this.saved.emit(effectiveDate);
        });
        this._componentRef.instance.onCancel.pipe(take(1)).subscribe(() => {
            this.cancelled.emit();
            this._dateFields = false;
            this.destroyComponent();
        });

        this.appRef.attachView(this._componentRef.hostView);
        const domElem = (this._componentRef.hostView as EmbeddedViewRef<ElectronicSignatureModalComponent>).rootNodes[0] as HTMLElement;
        document.body.appendChild(domElem);
    }

    toggleDateFields(): void {
        this._dateFields = !this._dateFields;
    }

    private destroyComponent(): void {
        if (this._componentRef) {
            this.appRef.detachView(this._componentRef.hostView);
            this._componentRef.destroy();
            this._componentRef = null;
        }
    }

    private applyMergeFields(signature: IESignatureContent, mergeFields: IMergeField[]): IESignatureContent {
        mergeFields.forEach((field) => (signature.Content = signature.Content.replace(field.target, field.value)));
        return signature;
    }
}
