const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development', // Set to 'production' for production builds

    devtool: 'source-map',

    entry: './src/index.ts', // Adjust the entry point as needed

    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
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
                use: ['style-loader', 'css-loader'],
            }
        ]
    },

    devServer: {
        port: 8080
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: 'Isometric tilemap'
        })
    ]
}
