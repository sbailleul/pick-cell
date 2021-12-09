const webpack = require("webpack");
const path = require('path');
module.exports = function override(config, env) {
    console.log(config)
    const publicPath = path.resolve(__dirname, './public');
    console.log(publicPath);
    config.plugins.push(new webpack.WatchIgnorePlugin([
        publicPath
    ]))
    return config;
}
