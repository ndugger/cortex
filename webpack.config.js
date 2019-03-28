const path = require('path');
const env = process.env;

const input = 'tests/index.ts';
const output = 'dist/';

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, input),
    devtool: 'cheap-module-eval-source-map',
    output: {
        filename: 'quark.js',
        path: path.resolve(__dirname, output)
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    { loader: 'ts-loader' }
                ]
            }
        ]
    },
    resolve: {
        alias: {
            // rno: path.resolve(__dirname, 'src/main/typescript/rno/')
        },
        extensions: [ '.ts', '.tsx', '.js', '.jsx' ]
    }
};
