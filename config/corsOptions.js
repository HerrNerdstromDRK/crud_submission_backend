const whitelist = [
  // TODO    'https://www.yoursite.com',
  "http://127.0.0.1:3000",
  "http://localhost:3000",
  "http://127.0.0.1:4000",
  "http://localhost:4000",
  "http://localhost:3500",
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
