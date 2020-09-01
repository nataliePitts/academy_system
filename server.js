//Import frameworks and others >>
const bodyParser = require('body-parser'),
  express = require('express'),
  mongoose = require('mongoose');

//Creating a variable for express >>
var app = express();

//Pug engine >>
app.set('view engine', 'pug');
app.use('/public', express.static(__dirname + '/public'));

//Middle function for Logging and action >>
// var mylogDB = function (req, res, next) {
//   var method = req.method;
//   var path = req.path;
//   var runmode = global.academyLog_db;
//   var add_log = new mongooseModel(method, path, runmode);
//   console.log(add_log);
//   LogModel.save();
//   console.log('Recording action to academy DB');
//   next();
// };
// app.use('/students', mylogDB);

//<< -- Connecting to DB's -- >>
//Connecting to Academy DB + global var >>
global.academy_db = mongoose.createConnection(
  'mongodb://localhost:27017/academy',
  { useNewUrlParser: true, useUnifiedTopology: true },
);
//Connecting to Academy Log DB + global var >>
global.academyLog_db = mongoose.createConnection(
  'mongodb://localhost:27017/academylog',
  { useNewUrlParser: true, useUnifiedTopology: true },
);

// HTML mode -- >>
app.use(bodyParser.urlencoded({ extended: false }));
// JSON mode -- >>
app.use(bodyParser.json());

//Error/Open cases >>
//Academy DB connection >
global.academy_db.on('error', function (err) {
  console.log('error conneting to Academy DB/server');
});
global.academy_db.on('open', function () {
  console.log('We have an opened connection to Academy DB');
});
//Academy Log DB connection >
global.academyLog_db.on('error', function (err) {
  console.log('error conneting to Academy Log DB/server');
});
global.academyLog_db.on('open', function () {
  console.log('We have an opened connection to Academy Log DB');
});

//Mini-Router app for Students >>
const studentRoute = require('./routes/studentRouter');
app.use('/student', studentRoute);

//Open server on port 8080 >>
app.listen(8080, function () {
  console.log('Server started on port 8080');
});
