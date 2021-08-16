const wbm = require('wbm');

wbm.start().then(async res => {
  console.log(res);
  await wbm.waitQRCode();
  for (let index = 0; index < 4; index++) {
    const phones = ['xxxxxx00001111'];
    const message = `Loop ${index}`;
    await wbm.send(phones, message);
  }
  await wbm.end();
}).catch(err => console.log(err));

