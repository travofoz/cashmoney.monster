module.exports = {
  apps: [{
    name: "cashmoney.monster",
    cwd: "/var/www/cashmoney.monster",
    script: "npm",
    args: "start",
    env: {
      PORT: 3535,
      NODE_ENV: "production"
    }
  }]
}
