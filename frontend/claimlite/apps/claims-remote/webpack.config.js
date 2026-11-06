// webpack.config.js for the CLAIMS REMOTE app
const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

const config = withModuleFederationPlugin({
  name: 'claims_remote',
  exposes: {
    './routes': './apps/claims-remote/src/app/claims.routes.ts'
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' })
  }
});

config.output = {
  ...config.output,
  publicPath: 'http://localhost:4201/',
  scriptType: 'text/javascript'
};

config.devServer = {
  hot: false,
  liveReload: false,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
  }
};

module.exports = config;
