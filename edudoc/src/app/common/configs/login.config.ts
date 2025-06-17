import { environment } from '@common/environments/environment';
import { ILoginConfig } from '@mt-ng2/login-module';

// the api key below is for BreckDemo and should be updated
export const LoginConfigOverride: ILoginConfig = {
    messageOverrides: {
        failedPattern: 'Valid passwords must be at least 8 characters, have a capital letter and number.',
        loginLabel: 'Sign in to start your session',
        signInButtonText: 'Sign In',
    },
    passwordPattern: '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d!$%@#£€*?&]{8,}',
    rememberFeature: {
        rememberOptions: 'rememberMe',
    },
};
