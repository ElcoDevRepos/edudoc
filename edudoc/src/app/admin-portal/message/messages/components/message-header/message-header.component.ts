import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';

import { MessageService } from '../../services/message.service';

@Component({
    selector: 'app-message-header',
    templateUrl: './message-header.component.html',
})
export class MessageHeaderComponent implements OnInit {
    id: number;
    header$: Observable<string>;
    readonly messageService = inject(MessageService);
    readonly route = inject(ActivatedRoute);

    ngOnInit(): void {
        this.header$ = this.messageService.Message.pipe(map((m) => m.Description ?? 'Add Message'));
    }
}
