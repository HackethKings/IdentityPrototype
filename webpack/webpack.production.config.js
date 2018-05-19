'use strict';
const path = require('path');
const webpack = require('webpack');
const rules = require('./webpack.rules');
const env = require('./.webpack.env');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const AssetsManifest = require('assets-webpack-plugin');
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

function _path(p) {
    return path.join(__dirname, '../', p);
}

const basicExtract = new ExtractTextPlugin("[name]-[contenthash].css");

function extract(loaders) {
    const fb = loaders.shift();
    return basicExtract.extract({fallback: fb, use: loaders});
}

const uglifyJsPlugin = new UglifyJSPlugin({
    uglifyOptions: {
        output: {
            comments: false
        },
        compress: {
            sequences: true,
            dead_code: true,
            conditionals: true,
            booleans: true,
            unused: true,
            if_return: true,
            join_vars: true,
            // drop_console: true
        },
        mangle: {
            reserved: ['$super', '$', 'exports', 'require']
        }
    }
});
let plugins = [
    new CleanWebpackPlugin(
        [_path('public/build')],
        {
            root: _path(''),
        }
    ),
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify('production')
        }
    }),
    basicExtract,
    new webpack.optimize.CommonsChunkPlugin({name: "commons", minChunks: 2}),
    new webpack.LoaderOptionsPlugin({debug: false, options: {context: __dirname}}),
    new webpack.HashedModuleIdsPlugin(),
    uglifyJsPlugin,
    new WebpackMd5Hash(),
    new ChunkManifestPlugin({
        filename: "chunk-manifest.json",
        manifestVariable: "webpackManifest"
    }),
    new AssetsManifest(),
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
    })
];

if (!env.minify) {
    plugins.splice(plugins.indexOf(uglifyJsPlugin), 1);
}
module.exports = {
    devtool: 'nosources-source-map',
    entry: require('./webpack.entries').production,
    output: {
        path: _path('/public/build/'),
        filename: '[name]-[chunkhash].js',
        chunkFilename: '[name]-[chunkhash].js',
        publicPath: ``
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
                use: extract([
                    {loader: 'style-loader'},
                    {
                        loader: 'css-loader',
                        options: {importLoaders: 5, minimize: env.minify, discardComments: {removeAll: true}}
                    },
                    {loader: 'sass-loader'},
                    {loader: 'postcss-loader'},
                ]),
            },
            {
                test: /\.css$/,
                use: extract([
                    {loader: 'style-loader'},
                    {
                        loader: 'css-loader',
                        options: {minimize: true, importLoaders: 3, discardComments: {removeAll: true}}
                    },
                    {loader: 'sass-loader'},
                    {loader: 'postcss-loader'}
                ])
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },
    resolve: require('./webpack.resolve'),
    externals: require('./webpack.externals'),
};
