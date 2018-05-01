export const httpRequest = (settings) => {
    return new Promise((resolve, reject) => {
        const method = settings.method || 'GET';
        const url = settings.url;
        if (!url) {
            return reject(new Error('without url'));
        }
        const header = settings.header || undefined;
        const data = settings.data || undefined;

        if (data && method === 'GET') return reject(new Error('change method'));

        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        if (header && header.length === 2) xhr.setRequestHeader(header[0], header[1]);
        data ? xhr.send(JSON.stringify(data)) : xhr.send();

        xhr.onload = function () {
            if (this.status === 200)
                resolve(this.response);
            else{
                const error = new Error();
                error.message = this.response;
                error.status = this.status;
                reject(error);
            }
        }

        xhr.onerror = function () {
            reject(new Error().message = 'Something went wrong');
        }
    });
}