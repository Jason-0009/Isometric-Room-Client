const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development', // Set to 'production' for production builds

    devtool: 'source-map',

    entry: './src/index.ts',

    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },

    resolve: {
        extensions: ['.ts', '.js'],
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader', // Inject styles into the HTML during development
                    'css-loader'   // Process CSS
                ]
            },
        ],
    },

    devServer: {
        static: path.join(__dirname, 'dist'),
        port: 8080
    },
    
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Isometric tilemap'
        })
    ]
};
