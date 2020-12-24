require('dotenv').config()
import app from "./app";
const path = require('path');
const { exec, spawn, fork } = require('child_process');

const child : any = fork(path.join(__dirname, 'sendSMS.js'))
child.on('message', (msg: any) => {
  console.log(msg)
})


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
