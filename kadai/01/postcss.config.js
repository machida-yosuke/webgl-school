module.exports = {
  plugins: [
    // ベンダープレフィックスを自動付与する
    require('autoprefixer')(),
    require('css-mqpacker')()
  ],
};
