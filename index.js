var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var helmet = require('helmet');
var fileUpload = require('express-fileupload');
var cors = require('cors');
var compression = require('compression');

//  Include Routes
var auth = require('./route/authRoute');
var alumni = require('./route/alumniRoute');
var corsOptions = {
  origin: 'https://localhost:8080',
  optionsSuccessStatus: 200 // For legacy browser support
}

app.set('view engine','ejs');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use("/public",express.static("public"));
app.use(cors()); 
app.use(compression()); 
app.use(fileUpload());
// Security Guards
app.use(helmet());

// // Token Initializations
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cross-Origin-Opener-Policy", "cross-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// Initialise App Routes
app.use('/api',auth); 
app.use('/api',alumni); 
app.use("/",express.static("public/frontend"));

// Start Server Instance
var port = process.env.PORT || 5020;
var server = app.listen(port, () => {
  console.log("Server started on Port : "+port);
});
 