'use strict';

const path = require('path');
const { StatsWriterPlugin } = require("webpack-stats-plugin")
const ReactServerWebpackPlugin = require('react-server-dom-webpack/plugin');

module.exports = {
  options: {
    verbose: true,
    // enableTargetBabelrc: true
  },
  modifyPaths(opts) {
    const paths = opts.paths;
    paths.appServerJs = path.join(paths.appPath, 'src/cli.server');
    paths.appServerIndexJs = path.join(paths.appPath, 'src/index.server');
    paths.appClientIndexJs = path.join(paths.appPath, 'src/index.client');
    return paths;
  },
  modifyWebpackOptions(opts) {
    const options = opts.options.webpackOptions;

    // Enable HtmlWebpackPlugin in iso app
    if (opts.env.target === 'web') {
      options.enableHtmlWebpackPlugin = true;
    }
    if (opts.env.target === 'node' && opts.env.dev) {
      options.startServerOptions.nodeArgs.push('--conditions react-server');
    }
    if (opts.env.target === 'node') {
      options.jsOutputFilename = `[name].server.js`;
      options.jsOutputChunkFilename = `[name].chunk.server.js`;
    }

    return options;
  },
  modifyWebpackConfig(opts) {
    const config = opts.webpackConfig;

    // Enable StatsWriterPlugin
    if (opts.env.target === 'web') {
      config.plugins = config.plugins.concat([
        // Write out stats file to build directory.
        new StatsWriterPlugin({
          filename: "../react-client-manifest.json" // Default
        })
      ]);
    }

    if (opts.env.target === 'node') {
      config.plugins = config.plugins.concat([
        new ReactServerWebpackPlugin({isServer: false})
      ]);
    }
    if (opts.env.target === 'web' && opts.env.dev) {
      config.devServer.writeToDisk = true;
    }

    return config;
  },
}
