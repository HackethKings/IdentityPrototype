const path = require('path');
module.exports = {
    extensions: [".js", '.ts', '.vue', '.json'],
    alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@crypto': path.join(__dirname, '../')
    },
    modules: [
        'node_modules',
        path.join(__dirname, '../src/'),
        path.join(__dirname, '../src/js'),
        path.join(__dirname, '../build/contracts'),
    ]
};
