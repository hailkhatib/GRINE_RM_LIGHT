const APP_VARIANT = process.env.APP_VARIANT || 'premium';

const CONFIGS = {
  light: {
    name: "GRINE RM Light",
    slug: "grine-rm-light",
    bundleId: "com.grine.rm.light",
    icon: "./assets/icon-advanced.png",
    splash: "./assets/splash-advanced.png",
    tier: "LIGHT",
    easProjectId: "49dad1f2-d586-4950-ae9d-86a43261849c"
  },
  advanced: {
    name: "GRINE RM Advanced",
    slug: "grine-rm-advanced",
    bundleId: "com.grine.rm.advanced",
    icon: "./assets/icon-light.png",
    splash: "./assets/splash-light.png",
    tier: "ADVANCED",
    easProjectId: "470a5c00-19de-4e48-a98d-9e610f5db00a"
  },
  premium: {
    name: "GRINE RM Premium",
    slug: "grine-rm-premium",
    bundleId: "com.grine.rm.premium",
    icon: "./assets/icon-premium.png",
    splash: "./assets/splash-premium.png",
    tier: "PREMIUM",
    easProjectId: "cf23ddbe-c6ee-42a0-9947-9fdef02222ed"
  }
};

const activeConfig = CONFIGS[APP_VARIANT] || CONFIGS.premium;

export default {
  expo: {
    name: activeConfig.name,
    slug: activeConfig.slug,
    version: "1.0.2",
    orientation: "portrait",
    icon: activeConfig.icon,
    userInterfaceStyle: "dark",
    splash: {
      image: activeConfig.splash,
      resizeMode: "contain",
      backgroundColor: "#0f172a"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: activeConfig.bundleId
    },
    android: {
      backgroundColor: "#0f172a",
      package: activeConfig.bundleId,
      adaptiveIcon: {
        foregroundImage: activeConfig.icon,
        backgroundColor: "#0f172a"
      }
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro"
    },
    extra: {
      tier: activeConfig.tier,
      eas: activeConfig.easProjectId ? { projectId: activeConfig.easProjectId } : undefined
    },
    assetBundlePatterns: [
      "**/*"
    ],
    plugins: [
      [
        "expo-build-properties",
        {
          android: {
            targetSdkVersion: 35
          }
        }
      ]
    ]
  }
};
