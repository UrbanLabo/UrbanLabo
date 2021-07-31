const express = require('express');
const mysql = require('mysql');

const app = express();
app.use(express.static('public'));

//MySQLへの接続
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mysmue861',
  database: 'uea'
});

//接続が出来ない時のエラー表示
connection.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('success');
});

//トップページへ
app.get('/', (req, res) => {
  res.render('top.ejs');
});

//サイトの目的ページへ
app.get('/aboutThisSite', (req, res) => {
  res.render('aboutThisSite.ejs');
});

//都市雇用圏とはのページへ
app.get('/aboutUEA', (req, res) => {
  res.render('aboutUEA.ejs');
});

//全国都市雇用圏マップ2015へ
app.get('/ueamap2015', (req, res) => {
  connection.query(
    'SELECT ueaCode, subName FROM ueadata2015',
        (error, results_ueaIndex) => {
          res.render('ueamap2015.ejs', {items_ueaIndex: results_ueaIndex});
        }
  );
});

//都市雇用圏詳細情報2015へ
app.get('/uea2015/:ueaCode', (req, res) => {
  //都市圏データの取得
  connection.query(
    'SELECT * FROM ueadata2015view WHERE ueaCode=?',
        [req.params.ueaCode],
        (error, results_uea) => {
            //市町村データの取得
            connection.query(
                'SELECT * FROM citydata2015 WHERE ueaCode=?',
                [req.params.ueaCode],
                (error_2, results_city) => {
                  //都市圏一覧情報の取得
                  connection.query(
                    'SELECT ueaCode, subName FROM ueadata2015',
                      (error, results_ueaIndex) => {
                        res.render('uea2015.ejs', {items_uea: results_uea, items_city: results_city, items_ueaIndex: results_ueaIndex});
                      }
                  );
                }
            );
        }
  );
});

//市町村通勤率2015のデータをcitymapInUea2015.jsに送信
app.get('/commuterData2015/:ueaCode/:cityCode', (req, res) => {
  connection.query(
      'SELECT a.toCode AS toCode, b.cityName AS toName, b.ueaCode AS toUeaCode, a.fromCode AS fromCode, c.cityName AS fromName, c.ueaCode AS fromUeaCode, a.commuterRate AS commuterRate ' +
      'FROM commuternetwork2015 AS a ' +
      'JOIN citydata2015 AS b ON a.toCode = b.cityCode ' +
      'JOIN citydata2015 AS c ON a.fromCode = c.cityCode ' +
      'WHERE b.ueaCode = ? AND c.ueaCode = ? AND a.toCode = ? ',
      [req.params.ueaCode, req.params.ueaCode, req.params.cityCode],
      (error, results) => {
          //console.log(results);
          res.json(results);
      }
  );
});

//2015年基準の人口推移データをpoptransition.jsに送信
app.get('/ueaData2015/:ueaCode', (req, res) => {
  connection.query(
    'SELECT * FROM ueadata2015 WHERE ueaCode=?',
    [req.params.ueaCode],
    (error, results) => {
      res.json(results);
    }
  );
});


app.listen(3000);