const common = require('./webpack.common.js');
const { merge } = require('webpack-merge');


module.exports = merge(common, {
    mode: 'production',
    cache: false,
    output: {
        filename: `naras.min.js`,

    },
})