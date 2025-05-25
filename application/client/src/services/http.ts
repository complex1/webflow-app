import axios from 'axios';

export class HttpService {
    auth: true;
    url: string;
    body: any;
    method: string;

    constructor() {
        this.auth = true;
        this.url = '';
        this.body = {};
        this.method = 'GET';
    }

    run () {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': this.auth ? `Bearer ${localStorage.getItem('token')}` : '',
        };

        return new Promise((resolve, reject) => {
            axios({
                method: this.method,
                url: this.url,
                headers: headers,
                data: this.body,
            })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                const data = error.response?.data;
                if (data) {
                    if (data.errorCode === 'INVALID_TOKEN') {
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                    }
                    if (data.errorCode === 'USER_NOT_FOUND') {
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                    }
                }
                reject(error);
            });
        });
    }
}