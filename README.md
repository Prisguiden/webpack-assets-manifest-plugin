# webpack-assets-manifest-plugin

Tries to solve the problem of loading generated webpack entries.

Generates `assets-manifest.json` containing the entries and generated files
from the webpack config

# Usage

If you have a `webpack.config.js` like for example this one

```js
const WebpackAssetsManifestPlugin = require("@prisguiden/webpack-assets-manifest-plugin")

module.exports = {
    entry: {
        bundle: [
            "./myapp.js"
        ],
        cssBundle: [
            "./myapp.sass"
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/[name].[chunkhash].css",
        }),
        new WebpackAssetsManifestPlugin({
            filename: "assets.json",
            extras: {
                myCustomBuildinfo: "example-build"
            }
        })
    ],
    output: {
        path: path.resolve(__dirname, "./public"
        filename: "js/[name].[chunkhash].js"
    }
}
```

Webpack will generate ./public/assets.json containing the following structure:

```json
{
    "js": {
        "bundle": [
            "./public/js/bundle.5cca44c5e79cf5d6f72a.js"
        ]
    },
    "css": {
        "cssBundle": [
            "./public/css/bundle.2caf49b5f28ff2d6c918.css"
        ]
    },
    "hash": "313076e4b078a32477b6",
    "myCustomBuildinfo": "example-build"
}
```

You can use this in your application to load the js and css files with their build hash

# Installation
```shell
npm install @prisguiden/webpack-assets-manifest-plugin --save
```
