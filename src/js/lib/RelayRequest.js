const USE_MOCKUP = true;
export default class RelayRequest {
    static LOGIN_ENDPOINT = '/login';
    static DEPLOY_ENDPOINT = '/deploy';

    static fetch(endpoint) {
        return new Promise((resolve) => {

            if (USE_MOCKUP) {
                switch (endpoint) {
                    case this.LOGIN_ENDPOINT:
                        break;
                    case this.DEPLOY_ENDPOINT:
                        break;
                }
                resolve(/*...*/);
            } else {
                // axios();
            }
        });
    }
}
