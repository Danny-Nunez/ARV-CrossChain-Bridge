module.exports = {
  // chainWebpack: config => {
  //   config.module.rules.delete("svg");
  // },
  // configureWebpack: {
  //   module: {
  //     rules: [
  //       {
  //         test: /\.svg$/, 
  //         loader: 'vue-svg-loader', 
  //       },
  //     ],
  //   }      
  // },
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    // port: 3000,
    headers: {
      // Cross-Origin-Opener-Policy: same-origin-allow-popups.

      // "Cross-Origin-Embedder-Policy-Report-Only": "require-corp",
      // "Cross-Origin-Opener-Policy-Report-Only": "same-origin",
      // "Cross-Origin-Embedder-Policy": "require-corp",
      // "Cross-Origin-Opener-Policy": "same-origin",
      // "Cross-Origin-Resource-Policy": "cross-origin",
      // "Access-Control-Allow-Origin": "*"
   }
 }
}
