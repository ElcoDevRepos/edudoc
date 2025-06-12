import { ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, EventEmitter, Injectable, Injector } from '@angular/core';
import { SharedModule } from '@common/shared.module';
import { take } from 'rxjs/operators';
import { ValidationModalComponent } from './validation-modal.component';

@Injectable({
    providedIn: SharedModule,
})
export class ValidationModalService {
    private _componentRef: ComponentRef<ValidationModalComponent>;

    saved: EventEmitter<void> = new EventEmitter<void>();
    cancelled: EventEmitter<void> = new EventEmitter<void>();

    constructor(private componentFactoryResolver: ComponentFactoryResolver, private appRef: ApplicationRef, private injector: Injector) {}

    showModal(isHardValidation, errorsResponse: string[]): void {
        this.destroyComponent();
        if (!errorsResponse.length) {
            this.saved.emit();
            this.destroyComponent();
        } else {
            this._componentRef = this.componentFactoryResolver.resolveComponentFactory(ValidationModalComponent).create(this.injector);
            this._componentRef.instance.isHardValidation = isHardValidation;
            this._componentRef.instance.errorsContent = errorsResponse;
            this._componentRef.instance.onPass.pipe(take(1)).subscribe(() =>  {
                this.saved.emit();
                this.destroyComponent();
            });
            this._componentRef.instance.onCancel.pipe(take(1)).subscribe(() => {
                this.cancelled.emit();
                this.destroyComponent();
            });

            this.appRef.attachView(this._componentRef.hostView);
            const domElem = (this._componentRef.hostView as EmbeddedViewRef<ValidationModalComponent>).rootNodes[0] as HTMLElement;
            document.body.appendChild(domElem);

        }

    }

    private destroyComponent(): void {
        if (this._componentRef) {
            this.appRef.detachView(this._componentRef.hostView);
            this._componentRef.destroy();
            this._componentRef = null;
        }
    }
}
