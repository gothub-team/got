import { badRequest, CORS_HEADERS, internalServerError } from '@gothub/aws-util';
import type { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { openApiSchema } from '../openApi/schema';

const API_BASE_URL = process.env.API_BASE_URL || '';

const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Got API</title>
    <!-- needed for adaptive design -->
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">

    <!--
    Redoc doesn't change outer page styles
    -->
    <style>
      body {
        margin: 0;
        padding: 0;
      }
      span.JIFSj.eqivia.sc-fbIWvP.sc-hmbstg {
        display: block;
        margin-bottom: 4px;
      }
    </style>
  </head>
  <body>
    <redoc spec-url='${API_BASE_URL}api'></redoc>
    <script src="https://cdn.jsdelivr.net/npm/redoc@latest/bundles/redoc.standalone.js"> </script>
  </body>
</html>
`;

const handle = async (accept?: string): Promise<APIGatewayProxyResult> => {
    if (!accept) {
        return badRequest('Accept header is required');
    }
    if (accept.includes('text/html')) {
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/html',
                ...CORS_HEADERS,
            },
            body: html,
        };
    }
    if (accept.includes('application/json') || accept.includes('*/*')) {
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                ...CORS_HEADERS,
            },
            body: JSON.stringify(openApiSchema(API_BASE_URL, process.env.npm_package_version)),
        };
    }

    return badRequest('Invalid Accept header');
};

export const handleHttp: APIGatewayProxyHandler = async (event) => {
    try {
        const result = await handle(event?.headers?.Accept || event?.headers?.accept);
        return result;
    } catch (err) {
        return internalServerError(err as Error);
    }
};

// export const handleInvoke: Handler = async ({ body }) => {
//     try {
//         const result = await handle(body as ValidationResult<Body>);
//         return result;
//     } catch (err) {
//         return internalServerError(err as Error);
//     }
// };
