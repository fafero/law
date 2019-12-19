const path = require('path')
const weebpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

module.exports = {
    entry: './src/server.js',
    output: {
        filename: 'server.js',
        path: path.resolve(__dirname, 'dist'),
    },
};