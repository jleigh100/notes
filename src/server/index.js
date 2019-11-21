import express from 'express';
import ejs from 'ejs';
import path from 'path';
import webpack from 'webpack';
import middleware from 'webpack-dev-middleware';
import webpackOptions from '../../webpack.config';
import bodyParser from 'body-parser';

const port = process.env.PORT || 3000;
let app = express();

var listOfData;

if (process.env.NODE_ENV !== 'production') {
  const compiler = webpack(webpackOptions);
  app.use(middleware(compiler, { publicPath: '/js' }));
}

app.use(bodyParser.urlencoded({extended: true}));

app.use('/js', express.static(path.join(__dirname, '../client/js')));
app.use('/css', express.static(path.join(__dirname, '../client/css')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));



var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '132.146.87.53',
  user     : 'sbc_monitor',
  password : 'QHbNsU7',
  database : 'test'
});

connection.connect();

app.get('/', (req, res) => {
  res.render('index', {title: 'SBC Monitor', data: listOfData});
});

app.get('/data', (req, res) => {
  connection.query(`
    SELECT ID, DATE_FORMAT( FROM_UNIXTIME( TimeStamp ) , '%Y-%m-%d %H:00' ) AS DATE, AVG( daemonMem ) AS daemonMem, CoreDumps, CoreUsage, HAState, Uptime, SystemMem
    FROM S3Results
    WHERE TimeStamp >= 1573642675
    GROUP BY ID, DATE_FORMAT( FROM_UNIXTIME( TimeStamp ) , '%Y-%m-%d %H:00' )
    ORDER BY TimeStamp DESC`, function (error, results, fields) {
    if (error) throw error;
    res.json(results);
  });
});

app.use(function (req, res) {
  res.status(404).render('error');
});



app.listen(port, (err) => {
  if (err) throw new Error(err);
  console.log(`Listening on port: ${port}`);
});
