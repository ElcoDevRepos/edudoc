import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';

import { MessageDocumentService } from '../../services/message-document.service';

@Component({
    selector: 'app-message-document-header',
    templateUrl: './message-document-header.component.html',
})
export class MessageDocumentHeaderComponent implements OnInit {
    header$: Observable<string>;
    readonly messageDocumentService = inject(MessageDocumentService);

    ngOnInit(): void {
        this.header$ = this.messageDocumentService.messageDocument.pipe(map((m) => m.Description ?? 'Add Message'));

    }
}
