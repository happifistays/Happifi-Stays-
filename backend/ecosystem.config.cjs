module.exports = {
  apps: [
    {
      name: "happifi-stays-backend",
      script: "./index.js",
      interpreter: "node",
      //   node_args: "--env-file=.env",
      instances: "max",
      exec_mode: "cluster",
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        JWT_SECRET: "secret_key",
        CLOUDINARY_NAME: "personalprojectaswins",
        CLOUDINARY_API_KEY: 343244986796635,
        CLOUDINARY_API_SECRET: "sEVNeeKFS57c0udTcVgbNdY8nuk",
        RAZORPAY_KEY_ID: "key_id",
        RAZORPAY_KEY_SECRET: "secret_key",
        DATABASE_URL_DEV:
          "mongodb+srv://aswinsts04_db_user:jwFoZJZEQTn9xlSS@cluster0.20hm0p4.mongodb.net/",
        EMAIL_USER: "",
        EMAIL_PASS: "",
      },
    },
  ],
};
