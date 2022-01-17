import Client from './customClient';

class Utils {
    static userIsLoggedIn = async () => {
        try {
            if (!localStorage['token']) return false;
            await Client.post('/verify-token');
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    };

    static saveWidget = async (id, params) => {
        try {
            await Client.post('/user/save-widget', {
                id,
                params: JSON.stringify(params),
            });
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    };

    static getSavedWidget = async () => {
        try {
            const widgets = await Client.get('/user/saved-widgets');
            return widgets;
        } catch (e) {
            console.log(e);
            throw e.message;
        }
    };
}

export default Utils;
