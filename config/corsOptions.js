const whitelist = [
  // TODO    'https://www.yoursite.com',
  "http://127.0.0.1:3000",
  "http://localhost:3000",
  "http://127.0.0.1:4000",
  "http://localhost:4000",
  "http://localhost:3500",
  "http://127.0.0.1:8080",
  "http://localhost:8080",
  "http://127.0.0.1:8888",
  "http://localhost:8888",
  "http://127.0.0.1:27017",
  "http://localhost:27017",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
