module.exports = {
    js: {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
            {
                loader: 'babel-loader',
            },
        ]
    },
    handlebars: {test: /\.(hbs|handlebars)$/, loader: "handlebars-loader"},
    fonts: {test: /\.(woff|woff2|eot|ttf)$/, exclude: /quill/, use: [{loader: 'url-loader'}]},
    svg: {test: /\.(svg)$/, use: [{loader: 'html-loader'}]},
    images: {test: /\.(png|jpg|gif)$/, use: [{loader: 'url-loader'}]},
    html: {
        test: /\.(html)/,
        use: 'raw-loader'
    },
    typescript: {
        test: /\.tsx?$/, use: [{
            loader: 'ts-loader',
            options: {
                compilerOptions: {
                    declaration: false,
                    target: 'es5',
                    module: 'commonjs'
                },
                transpileOnly: true
            }
        }]
    },
    dataTables: {
        test: /datatables\.net.*/,
        use: [{loader: 'imports-loader', options: {define: false}}]
    }
};
