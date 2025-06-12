import { Component, Input, OnInit } from '@angular/core';
import { LinkTypes } from '@model/enums/link-types.enum';
import { ILinkSelectorDTO } from '@model/interfaces/custom/link-selector.dto';
import { ExtraSearchParams } from '@mt-ng2/common-classes';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ProviderMessageService } from '../../provider-portal/dashboard/services/provider-message.service';

@Component({
    selector: 'app-documents-links-widget',
    styleUrls: ['./widget.component.less'],
    templateUrl: './documents-links-widget.component.html',
})
export class DocumentLinksWidgetComponent implements OnInit {
    @Input()
    documentLinks: ILinkSelectorDTO[];
    documentLinksView: ILinkSelectorDTO[];
    expandable = false;
    expanded = false;

    constructor(
        private providerMessageService: ProviderMessageService,
        private notificationsService: NotificationsService,
        ) {}

    ngOnInit(): void {
        this.getDocumentLinks();
    }

    private getDocumentLinks(): void {
                this.expandable = this.documentLinks.length > 5;
                this.documentLinksView = this.expandable ? this.documentLinks.slice(0, 5) : this.documentLinks;
    }

    goToSelectedPage(documentLink: ILinkSelectorDTO): void {
        if (documentLink.ProviderTraining && documentLink.ProviderTraining.DateCompleted === null) {
            documentLink.ProviderTraining.DateCompleted = new Date();
            this.providerMessageService.CompleteTraining(documentLink.ProviderTraining).subscribe(() => {
                this.notificationsService.success('Training marked complete.');
            });
        }
        window.open(documentLink.Link, '_blank');
    }

    expandView(): void {
        this.documentLinksView = this.documentLinks;
        this.expanded = true;
    }

    collapseView(): void {
        this.documentLinksView = this.documentLinks.slice(0, 5);
        this.expanded = false;
    }

    getDueDate(documentLink: ILinkSelectorDTO): string {
        return  documentLink.ProviderTraining && documentLink.ProviderTraining.DueDate !== null && documentLink.ProviderTraining?.DateCompleted == null ? ` - Due: ${new Date(documentLink.ProviderTraining.DueDate).toDateString()}` : '';
    }

    isLink(documentLink: ILinkSelectorDTO): boolean {
        return documentLink.LinkType === LinkTypes.Link;
    }

    isPdf(documentLink: ILinkSelectorDTO): boolean {
        return documentLink.Link.indexOf('.pdf') > 0 ? true : false;
    }
}
