// ecosystem.config.js
module.exports = {
    apps : [{
      name: "next-app",
      script: "./node_modules/next/dist/bin/next",
      args: "start",
      cwd: "E:\\registration-system",
      watch: true,
      env: {
        NODE_ENV: "production",
      }
    }]
  };