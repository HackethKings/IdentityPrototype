const path = require('path');
module.exports = {
    extensions: [".js", '.ts', '.svg', '.vue', '.json'],
    alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@crypto': path.join(__dirname, '../../')
    },
    modules: [
        'node_modules',
        path.join(__dirname, '../'),
        path.join(__dirname, '../../assets/'),
        path.join(__dirname, '../../assets/js/'),
        path.join(__dirname, '../../truffle/build/contracts')
    ]
};
