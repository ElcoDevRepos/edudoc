import { environment } from '@common/environments/environment';
import { ILoginConfig } from '@mt-ng2/login-module';

// the api key below is for BreckDemo and should be updated
export const LoginConfigOverride: ILoginConfig = {
    googleAuthConfig: environment.googleApiKey ? { googleApiKey: environment.googleApiKey } : null,
    messageOverrides: {
        failedPattern: 'Valid passwords must be at least 8 characters, have a capital letter and number.',
        loginLabel: 'Sign in to start your session',
        signInButtonText: 'Sign In',
    },
    passwordPattern: '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d!$%@#£€*?&]{8,}',
    rememberFeature: {
        rememberOptions: 'rememberMe',
    },

    /*
        Below are the remaining possible options for configuring the login component with their default values.
        Also see http://breckdemo.testing.milesapp.com/#/forms/login for a demonstraction
        of each configuration option.
    */

    // forgotPasswordMessage: 'Provide the email associated with your account and click Submit. An email will be sent with a link to reset your password.',
    // hideRegularSignIn: false,
    // loginComponentLinks: [
    //     new LoginComponentLink(
    //         '<a>I forgot my password</a>',
    //         '/forgotpassword',
    //     ),
    // ],
};
