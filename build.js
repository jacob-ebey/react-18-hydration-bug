import * as esbuild from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";

const watch = process.argv[2] === "watch";
build(
  watch
    ? {
        /**
         *
         * @param {esbuild.BuildFailure} error
         * @param {esbuild.BuildResult} result
         */
        async onRebuild(error, result) {
          let success = false;
          if (error) {
            success = await logErrorsAndWarnings(error);
          } else if (result) {
            success = await logErrorsAndWarnings(result);
          }

          if (!success) {
            console.error("rebuild failed");
            return;
          }

          console.info("rebuild succeeded");
        },
      }
    : false
);

async function build(watch) {
  const [clientSuccess, serverSuccess] = await Promise.all([
    buildClient(watch),
    buildServer(watch),
  ]);

  if (!clientSuccess || !serverSuccess) {
    console.error("build failed");
    process.exit(1);
  }

  console.info("build succeeded");
}

function buildClient(watch) {
  return esbuild
    .build({
      entryPoints: ["src/entry.client.tsx"],
      bundle: true,
      format: "esm",
      splitting: true,
      outdir: "./public/build",
      publicPath: "/build/",
      watch,
    })
    .then(logErrorsAndWarnings);
}

function buildServer(watch) {
  return esbuild
    .build({
      entryPoints: ["src/entry.server.tsx"],
      bundle: true,
      platform: "node",
      format: "esm",
      outfile: "./build/index.js",
      plugins: [nodeExternalsPlugin()],
      watch,
    })
    .then(logErrorsAndWarnings);
}

/**
 *
 * @param {esbuild.BuildResult | esbuild.BuildFailure} build
 */
async function logErrorsAndWarnings(build) {
  if (build.warnings.length > 0) {
    const warnings = await esbuild.formatMessages(build.warnings, {
      kind: "warning",
      color: true,
    });
    console.warn(...warnings);
  }

  if (build.errors.length > 0) {
    const errors = await esbuild.formatMessages(build.errors, {
      kind: "error",
      color: true,
    });
    console.error(...errors);

    return false;
  }

  return true;
}
