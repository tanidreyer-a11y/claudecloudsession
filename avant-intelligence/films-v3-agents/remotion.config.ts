import { Config } from "@remotion/cli/config";

// JPEG frames are much faster than PNG on this laptop and we have no transparency.
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
// Two Chrome tabs keep an 8 GB, 2-core machine responsive while rendering.
Config.setConcurrency(2);
Config.setOverwriteOutput(true);
