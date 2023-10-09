const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',

    devtool: 'source-map',

    entry: './src/index.ts',

    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },

    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            "@constants": path.resolve(__dirname, 'src/constants'),
            "@core": path.resolve(__dirname, 'src/core'),
            "@modules": path.resolve(__dirname, 'src/modules'),
            "@pathfinding": path.resolve(__dirname, 'src/pathfinding'),
            "@utils": path.resolve(__dirname, 'src/utils')
        }
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
            title: 'Isometric projection'
        })
    ]
}
