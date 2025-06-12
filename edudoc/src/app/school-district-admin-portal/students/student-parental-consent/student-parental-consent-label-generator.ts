import { DatePipe } from '@angular/common';
import { ILabelGenerator } from '@common/interfaces/ILabelGenerator';
import { ParentalConsentTypesEnum } from '@model/enums/parental-consent-types.enum';
import { IStudentParentalConsent } from '@model/interfaces/student-parental-consent';

export class StudentParentalConsentLabelGenerator implements ILabelGenerator {
    

    GetLabel(entity: IStudentParentalConsent): string {
        const label = ` <ul class="details-list">
                            <li><strong>Date Entered: </strong>${this.formatDate(entity.ParentalConsentDateEntered)}</li>
                            ${
                                entity.ParentalConsentTypeId !== ParentalConsentTypesEnum.PendingConsent
                                    ? `<li><strong>Effective Date: </strong>${this.formatDate(entity.ParentalConsentEffectiveDate)}</li>`
                                    : ''
                            }
                            <li><strong>Type: </strong>${entity.StudentParentalConsentType.Name || ''}</li>
                        </ul>`;
        return label;
    }

    formatDate(date: Date): string {
        return new DatePipe('en-US').transform(date, 'MMMM d, yyyy');
    }
}
