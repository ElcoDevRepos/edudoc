import { IEncounterStudent } from '@model/interfaces/encounter-student';

/**
 * The IEncounterHandler interface declares a method for building the chain of handlers.
 * It also declares a method for executing a request[index].
 */
export interface IEncounterHandler {
    errorResponse: string;

    setNext(handler: IEncounterHandler): IEncounterHandler;

    handle(
        index: number,
        request: IEncounterStudent[],
        errorsResponse: IEncounterResponse[],
        existingStudents: IEncounterStudent[],
        encounterServiceTypeId?: number,
        userServiceCode?: number
    ): IEncounterResponse[];
}

export interface IEncounterHandlerResponse {
    errorsResponse: IEncounterResponse[];
    isHardValidation: boolean;
}

export interface IEncounterResponse {
    message: string;
    invalidEntityId: number;
}

/**
 * The default chaining behavior can be implemented inside a base handler class.
 */
export abstract class AbstractEncounterHandler implements IEncounterHandler {
    private nextHandler: IEncounterHandler;
    errorResponse: string;

    public setNext(handler: IEncounterHandler): IEncounterHandler {
        if (handler) {
            this.nextHandler = handler;
            return handler;
        }
        // Returning a handler from here will let us link handlers in a
        // convenient way like this:
        // handler1.setNext(handler2).setNext(handler3);
        return this;
    }

    public handle(index: number, request: IEncounterStudent[], errorsResponse: IEncounterResponse[], existingStudents?: IEncounterStudent[], encounterServiceTypeId?: number, userServiceCode?: number): IEncounterResponse[] {
        if (this.nextHandler) {
            return this.nextHandler.handle(index, request, errorsResponse, existingStudents, encounterServiceTypeId, userServiceCode);
        }

        return errorsResponse;
    }
}

// function exampleComponentCode() {
//     const encounters: IEncounterStudent[] = [];
//     const index = 1;

//     let handlerResponse: IEncounterHandlerResponse = runEncounterValidationChain(index, {...encounters});

//     // Simple method for handling validation
//     if (handlerResponse.errorsResponse.length) {
//         if (handlerResponse.isHardValidation) {
//             // Display modal for hard popup
//             // return from formSubmitted()
//         } else {
//             // Display modal for soft popup
//             // If user proceeds and saves continue assigning formvalues
//             // else return from formSubmitted()

//         }
//     } else {
//         // Continue saving
//     }

//     // Method using service subscriptions
//     this.validationModalService.showModal(handlerResponse.isHardValidation, handlerResponse.errorsResponse);
//     this.subscriptions.add(
//         this.validationModalService.saved.subscribe(() => {
//             // This should be handled in a seperate function. Example here to show unsubscribe()
//             this.encounterStudentService
//                 .update(this.encounters[index])
//                 .pipe(finalize(() => this.subscriptions.unsubscribe()))
//                 .subscribe();
//         }),
//     );
//      this.subscriptions.add(
//          this.validationModalService.cancelled.subscribe(() => {
//              this.subscriptions.unsubscribe();
//              this.subscriptions.closed = false;
//          }),
//      );
// }
