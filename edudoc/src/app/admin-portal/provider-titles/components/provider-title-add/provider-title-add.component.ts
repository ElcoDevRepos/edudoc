import { Component, OnInit } from '@angular/core';

import { IProviderTitle } from '@model/interfaces/provider-title';
import { ProviderTitleService } from '../../services/provider-title.service';

@Component({
    selector: 'app-provider-title-add',
    templateUrl: './provider-title-add.component.html',
})
export class ProviderTitleAddComponent implements OnInit {
    providerTitle: IProviderTitle;
    canEdit = true; // route guard ensures this component wouldn't be loaded if user didn't have permission already

    constructor(private providertitleService: ProviderTitleService) {}

    ngOnInit(): void {
        this.providerTitle = this.providertitleService.getEmptyProviderTitle();
    }
}
