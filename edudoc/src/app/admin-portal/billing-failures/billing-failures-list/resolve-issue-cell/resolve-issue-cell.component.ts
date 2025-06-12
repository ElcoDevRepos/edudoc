import { BillingFailuresService } from '@admin/billing-failures/services/billing-failures.service';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { IBillingFailure } from '@model/interfaces/billing-failure';
import { IEntityListComponentMembers, IEntityListDynamicCellComponent } from '@mt-ng2/entity-list-module';
import { NotificationsService } from '@mt-ng2/notifications-module';

@Component({
    styles: [],
    templateUrl: './resolve-issue-cell.component.html',
})
export class BillingFailureResolveDynamicCellComponent implements IEntityListDynamicCellComponent, OnDestroy {
    entityListComponentMembers: IEntityListComponentMembers;
    entity: IBillingFailure;

    constructor(
        private notificationsService: NotificationsService,
        private billingFailureService: BillingFailuresService,
        private cdr: ChangeDetectorRef,
    ) {
    }



    resolveIssue(event: Event): void {
        event.stopPropagation();
        this.billingFailureService.resolveFailure(this.entity.Id).subscribe(() => {
            this.entity.IssueResolved = true;
            this.billingFailureService.setFailureResolvedId(this.entity.Id);
            this.notificationsService.success('Issue resolved successfully.');
            this.billingFailureService.emitChange(this.entity);
        });
    }

    ngOnDestroy(): void {
        this.cdr.detach();
    }
}
