
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable()
export class PendingChangesGuard  {
  canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
    // if a student has a plan type, just allow deactivation; else confirm first
    return component.canDeactivate() ?
      true :
      confirm('This student does not have a plan set up. Please add a plan in order to add this student to your caseload and create encounters. \n\nPress Cancel to go back and add a plan type, or OK to leave this page.');
  }
}