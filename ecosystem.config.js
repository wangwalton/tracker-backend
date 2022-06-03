module.exports = {
  apps: [
    {
      name: "openEatsBackend",
      script: "./dist/index.js",
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
