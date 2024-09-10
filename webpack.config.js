// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const webpack = require('webpack');

const config = {
    target: "node",
    mode: "production", //"development",//
    entry: './app.js',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, './webpack/'),
        libraryTarget: "commonjs"
    },
    externalsPresets: { node: true },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                "@babel/preset-env",
                                {
                                    useBuiltIns: "entry",
                                    corejs: {
                                        version: 3
                                    },
                                    targets: { node: "current" }
                                }
                            ]
                        ]
                    }
                }
            } 
        ],
    }
};

module.exports = () => {
    return config;
};
