// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=testing` then `environment.testing.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    apiVersion: '1',
    appName: 'Edu-Doc 4.0 \u00A9',
    appVersion: '1.0.0',
    assetsPath: 'assets/',
    authClientId: 1,
    authSecretVariable: 'verysecret',
    baseApiUrl: '',
    docPath: 'docs/',
    googleApiKey: '', // Empty this string to disable google login
    imgPath: 'docs/images/',
    logger: false,
    production: false,
    siteName: 'edudoc',
    submitHelpUrl: 'http://submit-help.testing.milesapp.com',
};
