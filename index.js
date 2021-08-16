const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const wbm = require('wbm');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', function (req,res){
  wbm.start().then(async wbmResponse => {
    res.send(`<img src=${wbmResponse} alt="qrCode" />`);
    await wbm.waitQRCode();
    for (let index = 0; index < 4; index++) {
      const phones = ['xxxxxx00001111'];
      const message = `Loop ${index}`;
      await wbm.send(phones, message);
    }
    await wbm.end();
  }).catch(err => console.log(err));
});

app.listen(3000,() => {
  console.log('Server On');
});



