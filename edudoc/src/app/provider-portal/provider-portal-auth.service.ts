import { Injectable } from '@angular/core';
import { ServiceCodeAcronymEnums, ServiceCodeEnums } from '@model/enums/service-code.enum';
import { IUserDetailCustomOptions } from '@model/interfaces/custom/user-detail-custom-options';
import { AuthService } from '@mt-ng2/auth-module';
@Injectable({ providedIn: 'root' })
export class ProviderPortalAuthService {
    referralTitles = [ServiceCodeAcronymEnums.AUD, ServiceCodeAcronymEnums.HCS, ServiceCodeAcronymEnums.HCO, ServiceCodeAcronymEnums.HCP];

    constructor(public authService: AuthService) {}

    private getCustomOptions(): IUserDetailCustomOptions {
        return this.authService.currentUser.getValue().CustomOptions as IUserDetailCustomOptions;
    }

    getProviderId(): number {
        const customOption = this.getCustomOptions();
        return customOption.UserAssociationId;
    }

    getProviderTitle(): string {
        const customOption = this.getCustomOptions();
        return customOption.Title;
    }

    getProviderServiceCode(): number {
        const customOption = this.getCustomOptions();
        return customOption.ServiceCodeId;
    }

    providerIsAssistant(): boolean {
        const customOption = this.getCustomOptions();
        return customOption.IsAssistant;
    }

    providerIsSupervisor(): boolean {
        const customOption = this.getCustomOptions();
        return customOption.IsSupervisor;
    }

    providerIsVerifiedORP(): boolean {
        const customOption = this.getCustomOptions();
        return customOption.VerifiedOrp;
    }

    updateProviderApproval(verified: boolean): void {
        const customOptions = this.getCustomOptions();
        customOptions.VerifiedOrp = verified;
        this.authService.updateCurrentUser({ CustomOptions: customOptions });
    }

    providerCanSignReferral(): boolean {
        return !this.providerIsAssistant() && this.providerIsVerifiedORP() && this.providerHasReferrals();
    }

    providerHasReferrals(): boolean {
        return this.referralTitles.includes(this.getProviderServiceCode());
    }

    providerIsLPN(): boolean {
        const providerTitle = this.getProviderTitle()?.toLowerCase();
        return providerTitle?.includes('lpn') || providerTitle?.includes('licensed practical nurse');
    }

    providerIsOTAorPTA(): boolean {
        const providerTitle = this.getProviderTitle()?.toLowerCase();
        return (
            providerTitle?.includes('ota') ||
            providerTitle?.includes('licensed occupational therapy assistant') ||
            providerTitle?.includes('pta') ||
            providerTitle?.includes('licensed physical therapy assistant')
        );
    }

    providerIsSpeechPathologist(): boolean {
        const providerTitle = this.getProviderTitle()?.toLowerCase();
        return (
            providerTitle?.includes('licensed speech-language pathologist') ||
            providerTitle?.includes('slp') ||
            providerTitle?.includes('licensed speech-language pathologist - assistant') ||
            providerTitle?.includes('lslpa')
        );
    }

    providerIsAudio(): boolean {
        return this.getProviderServiceCode() === ServiceCodeEnums.AUDIOLOGY;
    }

    providerIsSpeech(): boolean {
        return this.getProviderServiceCode() === ServiceCodeEnums.SPEECH_THERAPY;
    }

    providerIsPsychology(): boolean {
        return this.getProviderServiceCode() === ServiceCodeEnums.PSYCHOLOGY;
    }

    providerIsNurse(): boolean {
        return this.getProviderServiceCode() === ServiceCodeEnums.NURSING;
    }

    providerIsOTorPT(): boolean {
        const providerTitle = this.getProviderTitle()?.toLowerCase();
        return (
            providerTitle?.includes('ot') ||
            providerTitle?.includes('licensed occupational therapist') ||
            providerTitle?.includes('pt') ||
            providerTitle?.includes('licensed physical therapist')
        );
    }

    providerHasProgressReports(): boolean {
        return !this.providerIsNurse();
    }

    providerHasEvaluations(): boolean {
        return !this.providerIsOTAorPTA() && !this.providerIsLPN();
    }
}
