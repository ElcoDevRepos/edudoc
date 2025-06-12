import { ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, EventEmitter, Injectable, Injector } from '@angular/core';
import { SharedModule } from '@common/shared.module';
import { take } from 'rxjs/operators';
import { SupervisorApprovalModalComponent } from './supervisor-approval-modal.component';

@Injectable({
    providedIn: SharedModule,
})
export class SupervisorApprovalModalService {
    private _componentRef: ComponentRef<SupervisorApprovalModalComponent>;

    rejected: EventEmitter<string> = new EventEmitter<string>();

    constructor(private componentFactoryResolver: ComponentFactoryResolver, private appRef: ApplicationRef, private injector: Injector) {}

    showModal(): void {
        this.destroyComponent();

        this._componentRef = this.componentFactoryResolver.resolveComponentFactory(SupervisorApprovalModalComponent).create(this.injector);
        this._componentRef.instance.onReject.pipe(take(1)).subscribe((comments) => this.rejected.emit(comments));
        this._componentRef.instance.onCancel.pipe(take(1)).subscribe(() => {
            this.destroyComponent();
        });

        this.appRef.attachView(this._componentRef.hostView);
        const domElem = (this._componentRef.hostView as EmbeddedViewRef<SupervisorApprovalModalComponent>).rootNodes[0] as HTMLElement;
        document.body.appendChild(domElem);
    }

    private destroyComponent(): void {
        if (this._componentRef) {
            this.appRef.detachView(this._componentRef.hostView);
            this._componentRef.destroy();
            this._componentRef = null;
        }
    }
}
