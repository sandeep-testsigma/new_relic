import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { publishSourcemap } from "@newrelic/publish-sourcemap";
import fs from "fs/promises";
import path from "path";
import { config } from 'dotenv';

config();

const dryRun = false;

const JAVASCRIPTURL_BASE = process.env.VITE_PLUGIN_JAVASCRIPTURL_BASE;

const isNewRelicEnabled = process.env.NEWRELIC_ENABLED === "true" || dryRun;

// Wrap publishSourcemap in a Promise
const publishSourcemapAsync = (publishOptions) => {
  return new Promise((resolve, reject) => {
    publishSourcemap(publishOptions, (error, data) => {
      if (error) {
        if (error.response.body.code === 409) {
          console.log("✅ Sourcemap already published");
          resolve("already published");
        } else {
          console.error(
            "❌ Failed to publish sourcemap",
            error.response.body
          );
          reject(error);
        }
      } else {
        console.log("✅ Sourcemap published successfully");
        console.log(data);
        resolve(data);
      }
    });
  });
};

const newRelicSourcemapPlugin = () => {
  return {
    name: 'newrelic-sourcemap-plugin',
    
    closeBundle: async () => {
      if (isNewRelicEnabled) {
        try {
          console.log("🚀 Starting New Relic sourcemap upload...");
          
          // Validate required parameters
          const applicationId = process.env.NEWRELIC_APPLICATION_ID;
          const apiKey = process.env.NEWRELIC_API_KEY;
          if (!applicationId || !apiKey) {
            console.error(
              "❌ New Relic configuration missing required parameters"
            );
            return;
          }

          // Get the build output directory (usually 'dist' for Vite)
          const buildDir = path.resolve(process.cwd(), 'dist');
          
          // Function to recursively find and upload .map files
          const uploadMapFiles = async (dir: string) => {
            try {
              const entries = await fs.readdir(dir, { withFileTypes: true });
              
              for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                
                if (entry.isDirectory()) {
                  // Recursively process subdirectories
                  await uploadMapFiles(fullPath);
                } else if (entry.isFile() && entry.name.endsWith('.map')) {
                  // Upload .map file to New Relic
                  try {
                    // Get the relative path from dist directory
                    const relativePath = path.relative(buildDir, fullPath);
                    // Remove .map extension to get the JavaScript file name
                    const jsFileName = relativePath.replace(/\.map$/, '');
                    
                    const javascriptUrl = `${JAVASCRIPTURL_BASE}/${jsFileName}`;
                    
                    // Validate that javascriptUrl is not empty
                    if (!javascriptUrl || !jsFileName) {
                      console.error(`❌ Invalid javascriptUrl or jsFileName:`, {
                        javascriptUrl,
                        jsFileName,
                      });
                      throw new Error("javascriptUrl or jsFileName is empty");
                    }

                    const publishOptions = {
                      applicationId,
                      apiKey,
                      sourcemapPath: fullPath,
                      javascriptUrl: javascriptUrl,
                    };

                    console.log(`📤 Uploading sourcemap: ${relativePath} -> ${javascriptUrl}`);
                    if(!dryRun) {
                      const result = await publishSourcemapAsync(publishOptions);
                      if (result === "already published") {
                        console.log(`✅ Sourcemap already published: ${relativePath}`);
                      } else {
                        console.log(`✅ Sourcemap uploaded successfully: ${relativePath}`);
                      }
                    } else {
                      console.log(`🔍 Dry run: Would upload sourcemap: ${relativePath} -> ${javascriptUrl}`);
                    }
                    
                    // Remove the .map file after successful upload
                    await fs.unlink(fullPath);
                    console.log(`🗑️ Removed: ${fullPath}`);
                    
                  } catch (uploadError) {
                    console.error(
                      `❌ Failed to upload sourcemap ${entry.name}:`,
                      uploadError
                    );
                    // Don't remove the file if upload failed
                  }
                }
              }
            } catch (error) {
              // Ignore errors for non-existent directories
              if (error.code !== 'ENOENT') {
                console.warn(`⚠️ Error processing directory ${dir}:`, error.message);
              }
            }
          };
          
          // Upload .map files from build directory
          await uploadMapFiles(buildDir);
          console.log("✅ New Relic sourcemap upload completed");
          
        } catch (error) {
          console.error("❌ Failed to upload New Relic sourcemaps:", error);
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
    // minify: true,
    sourcemap: true,
  },
});
