import { HttpService } from './http';

export class UserService {

    login (email: string, password: string) {
        const http = new HttpService();
        http.url = '/api/login';
        http.method = 'POST';
        http.body = {
            email: email,
            password: password,
        };
        return http.run();
    }

    googleLogin(tokenId: string) {
        const http = new HttpService();
        http.url = '/api/auth/google';
        http.method = 'POST';
        http.body = {
            tokenId: tokenId
        };
        return http.run();
    }

    register (name: string, email: string, password: string, avatar: string) {
        const http = new HttpService();
        http.url = '/api/register';
        http.method = 'POST';
        http.body = {
            name: name,
            email: email,
            password: password,
            avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        };
        return http.run();
    }
 
    getUser() {
        const http = new HttpService();
        http.url = '/api/users/user';
        http.method = 'GET';
        return http.run();
    }
}