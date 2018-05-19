const autoprefixer = require('autoprefixer');
const path = require('path');

function _path(p) {
    return path.join(__dirname, p);
}

module.exports = {
    parser: 'postcss-scss',
    plugins: [
        autoprefixer({browsers: ['last 4 versions', 'ie >= 9']}),
    ]
};
