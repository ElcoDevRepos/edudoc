import { Injectable } from '@angular/core';
import { ILabelGenerator } from '@common/interfaces/ILabelGenerator';
import { IProvider } from '@model/interfaces/provider';

@Injectable({ providedIn: 'root' })
export class ProviderLabelGenerator implements ILabelGenerator {
    

    GetLabel(entity: IProvider): string {
        return `<label>Name: </label> <span>${entity.ProviderUser.FirstName} ${entity.ProviderUser.LastName}</span>
                <br>
                <label>Title: </label> <span>${entity.ProviderTitle.Name || ''}</span>
                <br>
                <label>Email: </label> <span>${entity.ProviderUser.Email} </span>`;
    }
}
