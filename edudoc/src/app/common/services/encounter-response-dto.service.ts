import { Injectable } from '@angular/core';
import { ICptCode } from '@model/interfaces/cpt-code';
import { ICptCodeWithMinutesDto, IEncounterResponseDto } from '@model/interfaces/custom/encounter-response.dto';
import { IGoal } from '@model/interfaces/goal';
import { IMethod } from '@model/interfaces/method';

@Injectable({
    providedIn: 'root',
})
export class EncounterResponseDtoService {
    getSessionMinutes(request: IEncounterResponseDto): number {
        let sumTime = 0;
        const millisecondsToMinutes = 60000;

        const startTime = new Date(`01/01/2011 ${request.StartTime}`).getTime();
        const endTime = new Date(`01/01/2011 ${request.EndTime}`).getTime();
        sumTime += endTime - startTime;

        return Math.trunc(sumTime / millisecondsToMinutes);
    }

    convertGoalsToCommaSeparatedList(items: IGoal[]): string {
        return EncounterResponseDtoService.convertGoalsToCommaSeparatedList(items);
    }

    static convertGoalsToCommaSeparatedList(items: IGoal[]): string {
        if (!items || !items.length) {
            return '';
        }
        return items.map((g) => g.Description).join(', ');
    }

    convertCptCodesToCommaSeparatedList(items: ICptCodeWithMinutesDto[]): string {
        return EncounterResponseDtoService.convertCptCodesToCommaSeparatedList(items);
    }

    static convertCptCodesToCommaSeparatedList(items: ICptCodeWithMinutesDto[]): string {
        if (!items || !items.length) {
            return '';
        }
        return items.length > 1
            ? items.map((c) => `${c.CptCode.Description}: ${c.Minutes} mins`).join(', \r\n')
            : items.map((c) => c.CptCode.Description).join('');
    }

    convertMethodsToCommaSeparatedList(items: IMethod[]): string {
        return EncounterResponseDtoService.convertMethodsToCommaSeparatedList(items);
    }

    static convertMethodsToCommaSeparatedList(items: IMethod[]): string {
        if (!items || !items.length) {
            return '';
        }
        return items.map((m) => m.Name).join(', ');
    }
}
