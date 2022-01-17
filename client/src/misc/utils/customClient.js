const prefixServerUrl = 'http://localhost:8080';

class Client {
    static async post(url, body) {
        const res = await fetch(prefixServerUrl + url, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${localStorage['token']}`,
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(body),
            credentials: 'include',
        });
        const json = await res.json();
        if (res.status !== 200) {
            throw json;
        }
        return json;
    }

    static async get(url, isAdmin = false) {
        const res = await fetch(prefixServerUrl + url, {
            method: 'GET',
            headers: {
                Authorization: isAdmin
                    ? `Bearer ${localStorage['adminToken']}`
                    : `Bearer ${localStorage['token']}`,
                'Access-Control-Allow-Credentials': true,
            },
            credentials: 'include',
        });
        const json = await res.json();
        if (res.status !== 200) {
            throw json;
        }
        return json;
    }
}

export default Client;
