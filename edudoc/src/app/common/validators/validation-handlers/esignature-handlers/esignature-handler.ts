import { IEncounterStudent } from '@model/interfaces/encounter-student';

/**
 * The IEsignHandler interface declares a method for building the chain of handlers.
 * It also declares a method for executing a request[index].
 */
export interface IEsignHandler {
    errorResponse: string;

    setNext(handler: IEsignHandler): IEsignHandler;

    handle(
        index: number,
        request: IEncounterStudent[],
        errorsResponse: IESignResponse[],
        encounterServiceType?: number,
        userServiceCode?: number,
        groupHandler?: boolean,
    ): IESignResponse[];
}

export interface IESignHandlerResponse {
    errorsResponse: IESignResponse[];
    isHardValidation: boolean;
}

export interface IESignResponse {
    message: string;
    invalidEntityId: number;
}

/**
 * The default chaining behavior can be implemented inside a base handler class.
 */
export abstract class AbstractESignHandler implements IEsignHandler {
    private nextHandler: IEsignHandler;
    errorResponse: string;
    isHardValidation: boolean;

    public setNext(handler: IEsignHandler): IEsignHandler {
        this.nextHandler = handler;
        // Returning a handler from here will let us link handlers in a
        // convenient way like this:
        // handler1.setNext(handler2).setNext(handler3);
        return handler;
    }

    public handle(index: number, request: IEncounterStudent[], errorsResponse: IESignResponse[], encounterServiceType?: number, userServiceCode?: number, groupHandler?: boolean): IESignResponse[] {
        if (this.nextHandler) {
            return this.nextHandler.handle(index, request, errorsResponse, encounterServiceType, userServiceCode, groupHandler);
        }

        return errorsResponse;
    }
}
