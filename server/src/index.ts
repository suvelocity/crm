const env = process.env.NODE_ENV || 'development';
//@ts-ignore
import db,{Class} from './models'
import {QueryInterface, Sequelize} from 'sequelize'
require('dotenv').config()
import app from "./app";
import { IClass } from './types';
import axios from 'axios'
import { urlencoded } from 'express';
// require("dotenv").config();
const port = process.env.PORT || 8080;

async function establishConnection() {
  const ngrok = require('ngrok');
  const url = await ngrok.connect(port);
  process.env.MY_URL = url;
  console.log('MY_URL', process.env.MY_URL);
}
if (env === 'development') {
  establishConnection()
  .then(async()=>{
    const {CM_ACCESS:cmAccess,MY_URL:url} = process.env  
    const classes :IClass[]= await Class.findAll()

    const ids = await Promise.all(
      classes
      .filter(({cmId})=>cmId)
      .map( async ({cmId,name})=>{
        const {data} = await axios.get(
          `http://35.239.15.221/api/v1/webhooks/events/registered/${cmId}`,
          {headers:{
            Authorization:cmAccess
          }}
        )
        const [{webhookUrl}] = data
        console.log(webhookUrl)
        const {data:response} = await axios.patch(
          `http://35.239.15.221/api/v1/webhooks/events/url/${cmId}`,
          {
            oldWebhookUrl: webhookUrl,
          newWebhookUrl: url + '/api/v1/event/challengeMe'
          },
          {headers:{
            Authorization:cmAccess
          }},
        )
        const {message} = response
        return ({[name] : message})
      })
      )
    console.log(ids)
  })
}
console.log('MY_URL', process.env.MY_URL);

console.log('port',process.env.PORT)
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
