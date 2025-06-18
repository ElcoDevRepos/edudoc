// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    apiVersion: '1',
    appName: 'EduDoc',
    appVersion: '1.0.0',
    assetsPath: 'assets/',
    authClientId: 1,
    authSecretVariable: 'verysecret',
    baseApiUrl: 'http://localhost:9000',
    docPath: 'http://localhost:9000/docs/',
    imgPath: 'http://localhost:9000/docs/images/',
    logger: true,
    production: false,
    siteName: 'edudoc',
    submitHelpUrl: '',
    v5FrontendUrl: 'http://localhost:4201/v5'
};
