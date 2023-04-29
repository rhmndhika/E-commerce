const express = require('express'); 
const app = express(); 
const cors = require("cors");
const port = 5000;
const dbConnect = require("./db/dbConnect");
const path = require('path');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const MemoryStore = require('memorystore')(session)
const dotenv =  require("dotenv");

const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const producttRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");

dotenv.config();

dbConnect();

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   },
// });
app.set('trust proxy', 1)

app.use(
  cors({
  origin: ["http://localhost:3000"], 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus : 200
}));

app.use(express.json());
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(bodyParser.urlencoded({extended: true}));

const store = MongoDBStore({
  collection: 'users',
  uri: process.env.MONGO_URL,
  expires: 1000
})

app.use(session({
  cookie : {
    secure: false,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000
  },
  name: "keyId",
  store: new MemoryStore({
    checkPeriod: 86400000
  }),
  secret: 'subscribe',
  saveUninitialized: true,
  resave: false
}))

app.use(cookieParser());

app.use(authRoute);
app.use(userRoute);
app.use(producttRoute);
app.use(cartRoute);
app.use(orderRoute);
app.use(stripeRoute);


app.listen(process.env.PORT || port, () => {
  console.log(`Listening on port ${port}`);
}) 

