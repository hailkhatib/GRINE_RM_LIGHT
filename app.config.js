const APP_VARIANT = process.env.APP_VARIANT || 'premium';

const CONFIGS = {
  light: {
    name: "GRINE RM Light",
    slug: "grine-rm-light",
    bundleId: "com.grine.rm.light",
    icon: "./assets/icon-advanced.png",
    splash: "./assets/splash-advanced.png",
    tier: "LIGHT"
  },
  advanced: {
    name: "GRINE RM Advanced",
    slug: "grine-rm-advanced",
    bundleId: "com.grine.rm.advanced",
    icon: "./assets/icon-light.png",
    splash: "./assets/splash-light.png",
    tier: "ADVANCED"
  },
  premium: {
    name: "GRINE RM Premium",
    slug: "grine-rm-premium",
    bundleId: "com.grine.rm.premium",
    icon: "./assets/icon-premium.png",
    splash: "./assets/splash-premium.png",
    tier: "PREMIUM"
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
      eas: {
        projectId: "8985ce70-f472-466c-94cc-408c9038e23f"
      }
    },
    assetBundlePatterns: [
      "**/*"
    ]
  }
};
