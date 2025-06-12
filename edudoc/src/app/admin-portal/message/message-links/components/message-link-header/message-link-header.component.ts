import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';

import { MessageLinkService } from '../../services/message-link.service';

@Component({
    selector: 'app-message-link-header',
    templateUrl: './message-link-header.component.html',
})
export class MessageLinkHeaderComponent implements OnInit {
    header$: Observable<string>;
    readonly messageLinkService = inject(MessageLinkService);


    ngOnInit(): void {
        this.header$ = this.messageLinkService.messageLink.pipe(map((m) => m.Description ?? 'Add Message'));
    }
}
