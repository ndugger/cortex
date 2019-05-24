const path = require('path');
const env = process.env;

const input = 'tests/sandbox.spec.tsx';
const output = 'dist/';

module.exports = {
    mode: 'development',
    entry: {
        todo: path.resolve(__dirname, 'examples/todo/index.tsx')
    },
    devtool: 'cheap-module-eval-source-map',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, output)
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            }
        ]
    },
    resolve: {
        alias: {
            cortex: __dirname
        },
        extensions: [
            '.ts',
            '.tsx',
            '.js',
            '.jsx'
        ]
    }
};
