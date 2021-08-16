const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const wbm = require('wbm');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', function (req,res){
    res.send(`<p>Hello World!<p/>`);
});

app.post('/whatsgun', async function (req,res){
  const companies = await axios.get('http://177.10.0.125:5001/v1/companies/all');
  var { toSend } = req.body;
  try {

    wbm.start().then(async wbmResponse => {
      res.send(`<img src=${wbmResponse} alt="qrCode" />`);
      await wbm.waitQRCode();

      for (var i = 0; i < companies.data.length; i++){
        const responsePhone = (companies.data[i].phone).split('(51) 9').join('5551').replace(/\D/g, "");

        const phones = [`${responsePhone}`];
        const message = `${toSend}`;
        await wbm.send(phones, message);
      }

      await wbm.end();
    }).catch(err => console.log(err));

  } catch(err) {
    console.log(err);
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

app.listen(3000,() => {
  console.log('Server On');
});