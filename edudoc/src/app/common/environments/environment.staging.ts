// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=staging` then `environment.staging.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

const baseUrl = 'https://hpc-edudoc-staging.net/v4';

export const environment = {
    apiVersion: '1',
    appName: 'EduDoc',
    appVersion: '1.0.0',
    assetsPath: 'assets/',
    authClientId: 1,
    authSecretVariable: 'verysecret',
    baseApiUrl: baseUrl,
    docPath: `${baseUrl}/docs/`,
    imgPath: `${baseUrl}/docs/images/`,
    logger: false,
    production: true,
    siteName: 'edudoc',
    submitHelpUrl: '',
    v5FrontendUrl: 'https://hpc-edudoc-staging.net/v5'
}; 