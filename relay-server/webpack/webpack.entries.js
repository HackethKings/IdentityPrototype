const path = require('path');

function _path(p) {
    return path.join(__dirname, p);
}

let base = {};

base = {
    server: _path('../entries/server.js'),
};

function insert(base, ...items) {
    return Object.keys(base).reduce(function (previous, current) {
        if (!base[current].splice) {
            base[current] = [base[current]];
        }
        previous[current] = Object.assign([], base[current]);
        previous[current].splice(0, 0, ...items);
        // console.log(previous[current]);
        return previous;
    }, {});
}

module.exports = {
    base,
    local: insert(base, "babel-polyfill"),
    production: insert(base, "babel-polyfill")
};
