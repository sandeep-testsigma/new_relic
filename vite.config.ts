import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { publishSourcemap } from "@newrelic/publish-sourcemap";
import fs from "fs/promises";
import path from "path";
import { config } from 'dotenv';

config();

const JAVASCRIPTURL_BASE = process.env.VITE_PLUGIN_JAVASCRIPTURL_BASE;

const isNewRelicEnabled = true;

const newRelicSourcemapPlugin = () => {
  return {
    name: "newrelic-sourcemap",
    generateBundle: async (options, bundle) => {
      if (isNewRelicEnabled) {
        try {
          // Validate required parameters
          const applicationId = process.env.NEWRELIC_APPLICATION_ID;
          const apiKey = process.env.NEWRELIC_API_KEY;
          if (!applicationId || !apiKey) {
            console.error(
              "❌ New Relic configuration missing required parameters"
            );
            return;
          }

          // Create temporary directory for source maps
          const tempDir = "./temp-sourcemaps";
          await fs.mkdir(tempDir, { recursive: true });

          // Extract source maps from bundle and write to temp directory
          let sourcemapCount = 0;
          for (const [fileName, file] of Object.entries(bundle)) {
            if (file && typeof file === 'object' && 'type' in file && 'map' in file && file.type === "chunk" && file.map) {
              const sourcemapPath = path.join(tempDir, `${fileName}.map`);
              // Ensure the directory exists before writing the file
              await fs.mkdir(path.dirname(sourcemapPath), { recursive: true });
              await fs.writeFile(sourcemapPath, JSON.stringify(file.map));
              sourcemapCount++;

              // Publish sourcemap immediately after writing
              try {
                const javascriptUrl = `${JAVASCRIPTURL_BASE}/${fileName}`;

                // Validate that javascriptUrl is not empty
                if (!javascriptUrl || !fileName) {
                  console.error(`❌ Invalid javascriptUrl or fileName:`, {
                    javascriptUrl,
                    fileName,
                  });
                  throw new Error("javascriptUrl or fileName is empty");
                }

                const publishOptions = {
                  applicationId,
                  apiKey,
                  sourcemapPath: sourcemapPath,
                  javascriptUrl: javascriptUrl,
                };

                publishSourcemap(publishOptions, async (error, data) => {
                  if (error) {
                    if (error.response.body.code === 409) {
                      console.log("✅ Sourcemap already published");
                    } else {
                      console.error(
                        "❌ Failed to publish sourcemap",
                        error.response.body
                      );
                    }
                  } else {
                    console.log("✅ Sourcemap published successfully");
                    console.log(data);
                  }
                });
              } catch (publishError) {
                console.error(
                  `❌ Failed to publish sourcemap ${fileName}.map:`,
                  publishError
                );
                // Clean up the file even if publish failed
                await fs.unlink(sourcemapPath).catch(() => {});
              }
            }
          }

          if (sourcemapCount === 0) {
            console.warn(
              "⚠️ No sourcemap files found in bundle. Make sure sourcemaps are enabled in build configuration."
            );
            await fs.rm(tempDir, { recursive: true, force: true });
            return;
          }

          // Clean up temp directory (should be empty now, but just in case)
          await fs.rm(tempDir, { recursive: true, force: true });
        } catch (error) {
          console.error("❌ Failed to publish New Relic sourcemaps:", error);
          console.error("Error details:", error.message);
        }
      }
    },
  };
};

// https://vite.dev/config/
export default defineConfig({
  base: '/new_relic/',
  plugins: [react(), isNewRelicEnabled && newRelicSourcemapPlugin()],
  build: {
    sourcemap: true,
  },
});
