const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

const config = withModuleFederationPlugin({
  name: 'claims',
  exposes: {
    './routes': './claims/src/app/claims/claims.routes.ts',
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});

config.output = {
  ...config.output,
  publicPath: 'http://localhost:4201/',
};

module.exports = config;
