module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // NOTE: Keep reanimated plugin last
      'react-native-reanimated/plugin'
    ],
  };
};
