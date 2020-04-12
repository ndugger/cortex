const path = require('path');

module.exports = {
    mode: 'production',
    entry: path.resolve(__dirname, 'src', 'index.ts'),
    // devtool: 'cheap-module-eval-source-map',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'pkg')
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
