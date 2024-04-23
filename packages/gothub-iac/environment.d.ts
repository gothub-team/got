declare global {
    namespace NodeJS {
        interface ProcessEnv {
            AWS_REGION: string;
            AWS_PROFILE: string;
            FILE_HOSTING_DOMAIN: string;
            FILE_HOSTING_BUCKET: string;
        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
