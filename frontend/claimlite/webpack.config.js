const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

const config = withModuleFederationPlugin({
  name: 'claimlite',
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});

config.output = {
  ...config.output,
  publicPath: 'http://localhost:4200/',
};

module.exports = config;
