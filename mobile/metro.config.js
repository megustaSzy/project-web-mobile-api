const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.alias = {
  lodash: 'lodash-es',
  'lodash/assign': 'lodash-es/assign',
  'lodash/differenceWith': 'lodash-es/differenceWith',
  'lodash/findIndex': 'lodash-es/findIndex',
  'lodash/get': 'lodash-es/get',
  'lodash/isEqual': 'lodash-es/isEqual',
};

module.exports = config;
