/**
 * Runs a POST request to the given URL with the given data.
 *
 * @param url URL to run the request to.
 * @param data Data to be sent in the request body. Will be JSON stringified.
 * @param idToken ID token to be sent in the request header.
 * @param asAdmin Whether or not to call the API in admin mode.
 *
 * @returns JSON parsed response. Returns `undefined` in case of 204 response.
 */
export const post = async <D, R>(
    url: string,
    data: D,
    idToken?: string,
    asAdmin?: boolean,
    asRole?: string,
): Promise<R> => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(idToken ? { Authorization: idToken } : {}),
            ...(asAdmin ? { 'x-as-admin': 'true' } : {}),
            ...(asRole ? { 'x-as-role': asRole } : {}),
        },
        body: JSON.stringify(data),
    });

    // if (response.status === 204) {
    //     return undefined;
    // }

    if (response.status < 400) {
        return response.json().catch((err) => {
            console.error('err', err);
        }) as Promise<R>;
    }
    return Promise.reject(await response.json());
};

/**
 * Runs a PUT request to the given URL with the given data.
 *
 * @param url URL to run the request to.
 * @param data Data to be sent in the request body. Will be sent as is.
 * @param contentType Content type to be sent in the request header.
 */
export const put = async <D extends BodyInit>(url: string, data: D, contentType: string): Promise<Response> => {
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': contentType,
        },
        body: data,
    });
    if (response.status < 400) {
        return response;
    }
    return Promise.reject(response);
};
