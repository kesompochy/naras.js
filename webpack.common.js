const path = require('path');

module.exports = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        library: {
            name: 'NARAS',
            type: 'umd',
            umdNamedDefine: true,
        },
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
            },
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
        roots: [__dirname],
        alias: {
        }
    },


};