const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const wbm = require('wbm');

const link = require('./services/credentials');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', function (req,res){
    res.send(`<p>Hello World!<p/>`);
});

app.get('/whatsgun', function(req, res){
    wbm.start().then(async wbmResponse => {
      return res.json({wbmResponse});
    }).catch(() => {
      return res.sendStatus(400).json({'Erro':'Problemas em Gerar QRCODE'});
    });
});

async function sendMessages(a) {
  const companies = await axios.get(`${link}`);
  for (var i = 0; i < companies.data.length; i++){
    const responsePhone = (companies.data[i].phone).split('(51) 9').join('5551').replace(/\D/g, "");

    const phones = [{responsePhone}];
    const message = `${a}`;
    await wbm.send(phones, message);
  }

  await wbm.end();
}

app.post('/whatsgun', async function(req, res) {
  console.log(link);
  const companies = await axios.get(`${link}`);
    var { toSend } = req.body;
    try {
      const waitQrCodeResponse = await wbm.waitQRCode();
      sendMessages(toSend)
      return res.json(companies.data.length);
    }catch(err) {
      console.log(err);
      res.sendStatus(400);
    }


});

app.post('/mailgun', function (req, res){
  var { host, port, fromEmail, pass, toEmail, title, message, content } = req.body;
    
  let transporter = nodemailer.createTransport({
    host: `${host}`,
    port: `${port}`,
    secure: true,
    auth: {
      user: `${fromEmail}`,
      pass: `${pass}`
    }
  });

  transporter.sendMail({
    from: `Nao responda <${fromEmail}>`,
    to: `${toEmail}`,
    subject: `${title}`,
    text: `${message}`,
    html: `${content}`
  }).then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
    res.sendStatus(400);
  });
  res.sendStatus(200);
});

app.listen(3030,() => {
  console.log('Server On');
});