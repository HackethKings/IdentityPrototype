'use strict';
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const rules = require('./webpack.rules');

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

/**
 * Webpack doesn't properly handles __dirname and __filename, this plugin fixes that
 */
class WebpackDirnamePlugin {
    apply(compiler) {

        let search, replace;
        if (process.env.NODE_ENV === 'production') {
            search = '';
            replace = '';
        } else {
            search = '';
            replace = '';
        }

        function setModuleConstant(expression, fn) {
            compiler.plugin("compilation", function (compilation, data) {
                data.normalModuleFactory.plugin("parser", function (parser, options) {
                    parser.plugin(`expression ${ expression }`, function () {
                        this.state.current.addVariable(expression, JSON.stringify(fn(this.state.module)));
                        return true;
                    });
                });
            });
        }

        setModuleConstant('__filename', function (module) {
            return module.resource.replace(search, replace);
        });

        setModuleConstant('__dirname', function (module) {
            return module.context.replace(search, replace);
        });
    }
}

function _path(p) {
    return path.join(__dirname, p);
}

let plugins = [
    new webpack.LoaderOptionsPlugin({debug: true, options: {context: __dirname}}),
    //
    // new webpack.DefinePlugin({
    //     $dirname: '__dirname',
    // }),
    // new NodeStuffPlugin()
    new WebpackDirnamePlugin()
];
var nodeModules = {};
fs.readdirSync(_path('../node_modules'))
    .filter(function (x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function (mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });
module.exports = {
    devtool: 'source-map',
    entry: require('./webpack.entries').local,
    target: 'node',
    output: {
        path: _path('/../build/'),
        filename: '[name].js'
    },
    plugins,
    module: {
        rules: [
            rules.js,
            rules.handlebars,
            rules.fonts,
            rules.images,
            rules.svg,
            rules.typescript,
            rules.html,
            {
                test: /\.scss$/,
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader', options: {importLoaders: 4, minimize: false}},
                    {loader: 'sass-loader'},
                    {loader: 'postcss-loader', options: {parser: 'postcss-scss'}},
                ],
            },
            {
                test: /\.css$/,
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader', options: {minimize: false}},
                    {loader: 'sass-loader'},
                    {loader: 'postcss-loader'}
                ]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },
    node: {
        __dirname: false,
        __filename: false,
    },
    resolve: require('./webpack.resolve'),
    externals: nodeModules
};
