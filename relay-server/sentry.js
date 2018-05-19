if (process.env.USE_SENTRY) {
    var Raven = require('raven');
    Raven.config('https://:@sentry.io/').install();
} else {
    function noop() {

    }
    var Raven = {
        captureException: noop
    };
}
export default Raven;
