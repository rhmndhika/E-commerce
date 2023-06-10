const express = require('express'); 
const app = express(); 
const cors = require("cors");
const port = 5000;
const dbConnect = require("./db/dbConnect");
const path = require('path');
const bodyParser = require('body-parser')
const dotenv =  require("dotenv");
const socketio = require('socket.io');
const server = require('http').createServer(app);
const io = socketio(server);
dotenv.config();

dbConnect();

app.set('trust proxy', 1)

// app.use(
//   cors({
//   origin: ["http://localhost:3000", "https://e-commerce-production-25ef.up.railway.app"], 
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   credentials: true,
//   optionsSuccessStatus : 200
// }));
app.use(cors());

app.use(express.json());
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(bodyParser.urlencoded({extended: true}));

// app.use(cookieParser());


// app.use(session({
//   cookie : {
//     secure: true,
//     sameSite: "none",
//     maxAge: 24 * 60 * 60 * 1000
//   },
//   name: "keyId",
//   store: new MemoryStore({
//     checkPeriod: 86400000
//   }),
//   secret: 'subscribe',
//   saveUninitialized: true,
//   resave: false
// }))

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000", "https://e-commerce-production-25ef.up.railway.app");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, PATCH, OPTIONS"
//   );
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   next();
// });


const authRoute = require("./routes/auth.js");
const userRoute = require("./routes/user.js");
const productRoute = require("./routes/Product");
const cartRoute = require("./routes/cart.js");
const orderRoute = require("./routes/order.js");
const stripeRoute = require("./routes/stripe.js");
const profileRoute = require("./routes/profile.js");
const wishlistRoute = require("./routes/wishlist.js");
const reviewRoute = require("./routes/review.js");
const recommendationRoute = require("./routes/recommendation.js");
const categoriesRoute = require("./routes/categories.js");
const notifRoute = require("./routes/notification.js");
const NotificationModel = require('./models/Notification.js');

app.use(authRoute);
app.use(userRoute);
app.use(productRoute);
app.use(cartRoute);
app.use(orderRoute);
app.use(stripeRoute);
app.use(profileRoute);
app.use(wishlistRoute);
app.use(reviewRoute);
app.use(recommendationRoute);
app.use(categoriesRoute);
app.use(notifRoute);

let adminOnline = false;


io.on('connection', (socket) => {
  console.log('A client connected');

  socket.on('adminOnline', () => {
    console.log('Admin online');

    // Store admin online status in the database or memory
    // For simplicity, let's assume there is a variable 'adminOnline' to store the status
    adminOnline = true;
  });

  socket.on('adminOffline', () => {
    console.log('Admin offline');

    // Update admin offline status in the database or memory
    adminOnline = false;
  });

  socket.on('getUnreadNotifications', async () => {
    try {
      const notifications = await NotificationModel.find({ status: 'unread' });
      socket.emit('unreadNotifications', notifications);
    } catch (error) {
      console.log(error);
    }
  });
});


server.listen(process.env.PORT || port, () => {
  console.log(`Listening on port ${port}`);
}) 

