const fs = require("fs");
const path = require("path");

class WebpackAssetsManifestPlugin {
  constructor(options) {
    this.options = options;
    if (!this.options.filename) {
      this.options.filename = "assets-manifest.json";
    }
  }
  apply(compiler) {
    compiler.hooks.done.tap("Manifest Plugin", stats => {
      let chunkGroups = stats.toJson().namedChunkGroups;
      let chunks = stats.toJson().chunks;
      let webRoot = stats.compilation.outputOptions.path;
      let manifest = {
        js: {},
        css: {},
        map: {}
      };

      for (let chunkGroupName in chunkGroups) {
        let chunkGroupIds = chunkGroups[chunkGroupName].chunks;

        for (let chunkGroupId of chunkGroupIds) {
          // Find the chunk element with property
          // .id === chunkGroupId
          let chunk = chunks.reduce((c, e) => {
            if (e.id === chunkGroupId) {
              c = e;
            }
            return c;
          });
          for (let file of chunk.files) {
            let fileParts = file.split(".");
            let fileType = fileParts.pop();

            if (!manifest[fileType][chunkGroupName]) {
              manifest[fileType][chunkGroupName] = [];
            }

            manifest[fileType][chunkGroupName].push("/" + file);
          }
        }
      }

      // Add custom properties to manifest
      if (this.options.extras) {
        for (let k in this.options.extras) {
          manifest[k] = this.options.extras[k];
        }
      }

      // Add webpack hash if none are specified
      if (!manifest.hash) {
        manifest.hash = stats.hash;
      }

      let data = JSON.stringify(manifest);
      fs.writeFileSync(path.join(webRoot, this.options.filename), data);
    });
  }
}

module.exports = WebpackAssetsManifestPlugin;
