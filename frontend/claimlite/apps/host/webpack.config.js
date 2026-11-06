// webpack.config.js for the HOST app
const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

const config = withModuleFederationPlugin({
  remotes: {
    'claims_remote': 'http://localhost:4201/remoteEntry.js'
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' })
  }
});

config.output = {
  ...config.output,
  publicPath: 'http://localhost:4200/',
  scriptType: 'text/javascript'
};

config.devServer = {
  ...config.devServer,
  historyApiFallback: true
};

module.exports = config;
