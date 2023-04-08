const express = require('express'); 
const app = express(); 
const cors = require("cors");
const port = 5000;
const dbConnect = require("./db/dbConnect");
const path = require('path');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const http = require('http');
const { Server } = require('socket.io');
const dotenv =  require("dotenv");

dotenv.config();


dbConnect();


const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const producttRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  },
});

app.use(
  cors({
  origin: ["http://localhost:3000", "http://localhost:5000"], 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus : 200
}));

app.use(express.json());
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
  key : 'userId',
  secret: 'subscribe',
  resave: false,
  saveUninitialized: false,
  cookie : {
    expires : 60 * 60 * 24,
  }
}));

app.use(authRoute);
app.use(userRoute);
app.use(producttRoute);
app.use(cartRoute);
app.use(orderRoute);
app.use(stripeRoute);

server.listen(process.env.PORT || port, () => {
  console.log(`Listening on port ${port}`);
}) 

