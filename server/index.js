const express = require('express'); 
const app = express(); 
const cors = require("cors");
const port = process.env.PORT || 5000;
const dbConnect = require("./db/dbConnect");
const path = require('path');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const http = require('http');
const { Server } = require('socket.io');



dbConnect();

const UserModel = require('./models/User')
const registerRoute = require("./routes/Register");
const loginRoute = require("./routes/Login");
const productRoute = require("./routes/Product");

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

app.use(registerRoute);
app.use(loginRoute);
app.use(productRoute);

// create a GET route
app.get('/express_backend', (req, res) => { 
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
}); 

app.get('/getUser', (req, res) => { 
  UserModel.find({}, (err, result) => {
    if (err) {
      res.json(err)
    } else {
      res.json(result)
    }
  })
}); 


// This displays message that the server running and listening to specified port
server.listen(port, () => {
  console.log(`Listening on port ${port}`);
}) 

