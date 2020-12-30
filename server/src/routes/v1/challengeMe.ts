import e, { Router, Request, Response } from "express";
import axios from 'axios'
//@ts-ignore
import db,{ Event, Student, Teacher, Company, Class, sequelize,} from "../../models";
import { IClass, ITeacher, IStudent } from "../../types";
import { eventsSchema } from "../../validations";
import transporter from "../../mail";
import { QueryInterface } from "sequelize/types";

const router = Router();

interface ICMUser{
  userName: string; // the userName to be used for login.
  email: string;
  firstName?:string;
  lastName?:string;
  country?:string;
  city?:string;
  birthDate?:string;
  phoneNumber?:string;
  reasonOfRegistration?:string;
  githubAccount?:string;

}
interface ICMEventRegistration{
  webhookUrl: string;  // webhook address to send events to you on
  events: ("submittedChallenge"|"startedChallenge")[];// array of strings, event names to listen for
  authorizationToken: string; 
  // the requesting team's Access token to ChallengeMe
}
interface ICMTeam{
  teamName: string;

  leaders: { userName:string}[];

  usersToCreate?: ICMUser[]

  eventsRegistration?: ICMEventRegistration //  Webhook registration data to register a webhook for the team

}

router.post('/team/forClass/:id',async (req,res)=>{
  const {MY_URL:url,CM_ACCESS:cmAccess} = process.env
  
  function generateUsername(email:string): string|never {
    const regex = /[\n\w\.]*@[\n\w]*/
    const match = email.match(regex)  
    if(match){
      const userName = match[0].replace('@','')
      return userName;
    }else{
      throw `invalid email "${email}"` 
    }
  }
  
  try{
    if (!url||!cmAccess){
      throw `env variables missing ${url?'CM_ACCESS':'URL'}`
    }
    const {id} = req.params
    const classToAdd :IClass & {
      Teachers:ITeacher[],
      Students:IStudent[]
    } = await Class.findOne({
      where:{id},
      include:['Students','Teachers'],
      attributes:['name','course']
    })
    
    if(!classToAdd){throw 'no such class'}
    
    
    const {Students,Teachers,name,course,cycleNumber,cmId} = classToAdd 
    
    if(cmId){throw "can't create with no teachers"}
    if(!Teachers.length){throw "can't create with no teachers"}
    
    const leadersWithNoUser : {[key:number]:ICMUser} = {}

    const leaders :ICMTeam['leaders'] = Teachers
    .map(({cmUser,email,id})=>{
        const userName = cmUser || generateUsername(email)
        if((!cmUser)&&id){
          leadersWithNoUser[id] = { email,userName } 
        }
        return { userName }
    })
    
    const usersToCreate : ICMTeam['usersToCreate'] = Students
    .map(({email})=>{
      return {
        email,
        userName: generateUsername(email)
      }
    })
    .concat(Object.values(leadersWithNoUser))

    const teamName : ICMTeam['teamName'] = `${course}(${cycleNumber}) "${name}"`
    
    const eventsRegistration :ICMTeam['eventsRegistration'] = {
      webhookUrl: url+'/api/v1/event/challengeMe',
      events: ["submittedChallenge","startedChallenge"],
      authorizationToken: cmAccess 
    }
    const CMTeam :Required< ICMTeam > = {
      leaders,usersToCreate, teamName, eventsRegistration
    }
    // const {data:response} = await axios.post(
      //   'http://35.239.15.221:8080/api/v1/webhooks/teams',
      //   CMTeam,
      //   {
        //     headers:{
          //       Authorization: cmAccess
          //     }
          //   }
          // )
          await Promise.all(
            Object.entries(leadersWithNoUser)
            .map(([userId,user])=>{
            return Teacher.update(
              {cmUser:user.userName},
              {where:{
                id:userId
              }})
          })
          )
          // res.json(classToAdd)          
          res.json(CMTeam)
        }catch(err){
          console.error(err)
          res.json({
            status:'error',
      message:err
    })
  }
})

// router.post('/team',async (req,res)=>{
//   const {MY_URL:url,CM_ACCESS:cmAccess} = process.env
//   if (!url){throw ('no url!')}
//   if (!cmAccess){throw ('no cm Access!')}
//   try{
//     const {body} = req
//     body.eventsRegistration={
//       webhookUrl: url+'/api/v1/webhook/event', 
//       events: [
//         "Started Challenge",
//         "Submitted Challenge"
//       ],
//       authorizationToken: cmAccess 
//     }
//     console.log(url+'/api/v1/webhook/event')
//     const {data:team} =  await axios.post(
//       'http://35.239.15.221:8080/api/v1/webhooks/teams',
//       body,
//       {
//         headers:{
//           Authorization: cmAccess,
//           contentType:'application/json'
//         }
//       }
//       )
//       res.json(team)
//     }catch(err){
//       console.error(err)
//       res.json({status:'error',message:err.message})
//     }
// })
router.post('/signup',async (req,res)=>{
  const {MY_URL:url,CM_ACCESS:cmAccess} = process.env
  if (!url){throw ('no url!')}
  if (!cmAccess){throw ('no cm Access!')}
  try{
    const {body} = req
    body.eventsRegistration={
      webhookUrl: url+'/api/v1/webhook/event', 
      events: ["submittedChallenge", "startedChallenge"],
      authorizationToken: cmAccess 
    }
    console.log(url+'/api/v1/webhook/event')
    const {data:team} =  await axios.post(
      'http://35.239.15.221:8080/api/v1/webhooks/teams',
      body,
      {
        headers:{
          Authorization: cmAccess,
          contentType:'application/json'
        }
      }
      )
      res.json(team)
    }catch(err){
      console.error(err)
      res.json({status:'error',message:err.message})
    }
})

router.post('/event',async (req,res)=>{
  const {body} = req
  console.log('CM event received')
  console.log(body)
  res.status(200).send('received')
})

export default router;
