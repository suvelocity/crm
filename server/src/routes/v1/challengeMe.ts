import e, { Router, Request, Response } from "express";
import axios from 'axios'
//@ts-ignore
import db,{ Event, Student, Teacher, Company, Class, sequelize,} from "../../models";
import { IClass, ITeacher, IStudent,} from "../../types";
import { eventsSchema } from "../../validations";
import transporter from "../../mail";
import { QueryInterface } from "sequelize/types";
import messageHtml from './message'
const router = Router();
const eventRoute = '/api/v1/event/challengeMe'

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
  events: ("Submitted Challenge"|"Started Challenge")[];// array of strings, event names to listen for
  authorizationToken: string; 
  // the requesting team's Access token to ChallengeMe
}
interface ICMTeam{
  teamName: string;

  leaders: { userName:string}[];

  usersToCreate?: ICMUser[]

  eventsRegistration?: ICMEventRegistration //  Webhook registration data to register a webhook for the team

}
interface ICMTeamResponse{
  message: string;
  leaders: { userName:string}[];
  teamId: string;
  newUsers?:{
    userName: string;
    email: string;
    password: string;
  }[];
  eventRegistrationStatus:201;
  eventRegistrationMessage: string;
}


router.post('/team/forClass/:id',async (req,res)=>{
  const {MY_URL:url,CM_ACCESS:cmAccess} = process.env
  
  function generateUsername(firstName:string,lastName:string,idNumber:string): string {
    // const regex = /[\n\w\.]*@[\n\w]*/
    // const match = email.match(regex)  
    // if(match){
      const userName = firstName+lastName+String(idNumber!).substring(0,2)
      return userName;
    // }else{
      // throw `invalid email "${email}"` 
    // }
  }
  function composeMail(
  to: string,
  userName: string,
  password: string,
  course:string,
){
  return {
    from: process.env.EMAIL_USER,
    to: to,
    subject: `ChallengeMe Account for your ${course} course `,
    html:messageHtml(userName,password),
    text: `
Hello,
Welcome to our program! 
In the upcoming course, you will be using the ChallengeMe system.
It is a system for submitting tasks, learning and more.
Provided below are your username and password for access into the system.

user: ${userName}
password:${password}

Good luck! we hope to see you soon.
suvelocity`,
}
  };

  try{

    if (!url||!cmAccess){
      throw `env variables missing ${url?'CM_ACCESS':'URL'}`
    }

    const {id} = req.params

    const classToAdd :IClass & {
      Teachers:ITeacher[],
      Students:IStudent[],
    } = await Class.findOne({
      where:{id},
      include:['Students','Teachers'],
      attributes:['id','name','course','cycleNumber','cmId']
    })
    
    if(!classToAdd){throw 'no such class'}
    
    
    const {Students,Teachers,name,course,cycleNumber,cmId} = classToAdd 
    
    if(cmId){throw "class already integrated"}
    
    if(!Teachers.length){throw "can't create with no teachers"}
    
    const leadersWithNoUser : {[key:number]:ICMUser} = {}

    const leaders :ICMTeam['leaders'] = Teachers
    .map(({cmUser,firstName,lastName,idNumber,email,id})=>{
        const userName = cmUser || generateUsername(firstName,lastName,String(idNumber))
        if((!cmUser)&&id){
          leadersWithNoUser[id] = { email,userName } 
        }
        return { userName }
    })
    
    const usersToCreate : ICMTeam['usersToCreate'] = Students
    .map(({firstName,lastName,idNumber,email})=>{
      return {
        email,
        userName: generateUsername(firstName,lastName,String(idNumber))
      }
    })
    .concat(Object.values(leadersWithNoUser))

    const teamName : ICMTeam['teamName'] = `${course}${cycleNumber}${name}`.slice(0,32).replace(' ','')
    
    const eventsRegistration :ICMTeam['eventsRegistration'] = {
      webhookUrl: url+eventRoute,
      events:["Submitted Challenge","Started Challenge"],
      authorizationToken: cmAccess 
    }
    const CMTeam :Required< ICMTeam > = {
      leaders,usersToCreate, teamName, eventsRegistration
    }
    
    const {data}:{data:ICMTeamResponse} = await axios.post(
      'http://35.239.15.221/api/v1/webhooks/teams',
      CMTeam,
      {
        headers:{
          Authorization: cmAccess
        }
      }
    ).catch(e=>{
      throw e.response.data
    })

    const { 
      eventRegistrationMessage,
      eventRegistrationStatus,
      teamId,
      message,
      newUsers
    } :ICMTeamResponse= data
    
    // record the class' CM id 
    await Class.update({cmId:teamId},{where:{id:id}})
    
    // mail new users their new credentials 
    if(newUsers){ 
      await Promise.all(newUsers.map(({email,userName,password})=>{
        return transporter.sendMail(composeMail(email,userName,password,course))
      }))
    }
    // update teachers that didn't have a cmUser
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
    
    res.json({
      message,
      teamId,
      eventRegistrationMessage,
      eventRegistrationStatus,
    })
    
  }catch(err){
    console.error(err)
    res.status(400).json({
      status:'error',
      message:err.message?err.message:err,
    })
  }
})

// router.post('/webhook/forClass/:id',async (req,res)=>{
//   const {MY_URL:url,CM_ACCESS:cmAccess} = process.env
//   try{
//     if (!url||!cmAccess){
//       throw `env variables missing ${url?'CM_ACCESS':'URL'}`
//     }
//     const {id} = req.params

//     const classToAdd :IClass & {
//     } = await Class.findOne({
//       where:{id},
//       include:['Students','Teachers'],
//       attributes:['id','name','course','cycleNumber','cmId']
//     })
    
//     if(!classToAdd){throw 'no such class'}
//     'http://35.239.15.221:8080/api/v1/webhooks/events/registration/:teamId'

//     const webhookRequest : ICMEventRegistration ={
//       authorizationToken:cmAccess,
//       events: ["Started Challenge","Submitted Challenge"],
//       webhookUrl: url+eventRoute
//     }
    
//     const {Students,Teachers,name,course,cycleNumber,cmId} = classToAdd 
    
//     if(cmId){throw "can't create with no teachers"}
    
//     if(!Teachers.length){throw "can't create with no teachers"}
    
//     const leadersWithNoUser : {[key:number]:ICMUser} = {}

//     const leaders :ICMTeam['leaders'] = Teachers
//     .map(({cmUser,email,id,firstName,lastName,idNumber})=>{
//         if((!cmUser)&&id){
//           leadersWithNoUser[id] = { email,userName } 
//         }
//         return { userName }
//     })
    
//     const usersToCreate : ICMTeam['usersToCreate'] = Students
//     .map(({email,firstName,lastName,idNumber})=>{
//       return {
//         email,
//         // userName: generateUsername(firstName,lastName,String(idNumber))
//       }
//     })
//     .concat(Object.values(leadersWithNoUser))

//     const teamName : ICMTeam['teamName'] = `${course}${cycleNumber}${name}`.slice(0,32).replace(' ','')
    
//     const eventsRegistration :ICMTeam['eventsRegistration'] = {
//       webhookUrl: url+'/api/v1/event/challengeMe',
//       events: ["Submitted Challenge","Started Challenge"],
//       authorizationToken: cmAccess 
//     }
//     const CMTeam :Required< ICMTeam > = {
//       leaders,usersToCreate, teamName, eventsRegistration
//     }
//     const {data} = await axios.post(
//       'http://35.239.15.221:8080/api/v1/webhooks/teams',
//       CMTeam,
//       {
//         headers:{
//           Authorization: cmAccess
//         }
//       }
//     ).catch(e=>{
//       throw e.response.data
//     })

//     console.log(data)
//     const { 
//       eventRegistrationMessage,
//       eventRegistrationStatus,
//       teamId,
//       message
//     } = data
    
//     await Class.update({cmId:teamId},{where:{id}})
//     await Promise.all(
//       Object.entries(leadersWithNoUser)
//       .map(([userId,user])=>{
//         return Teacher.update(
//           {cmUser:user.userName},
//           {where:{
//             id:userId
//           }})
//         })
//       )
//     res.json({
//       message,
//       teamId,
//       eventRegistrationMessage,
//       eventRegistrationStatus,
//     })
    
//   }catch(err){
//     console.error(err)
//     res.status(400).json({
//       status:'error',
//       message:err.message?err.message:err,
//       error:err.isAxiosError?err.response:undefined
//     })
//   }
// })

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
      res.json({status:'error',message:err.message?err.message:''})
    }
})

router.post('/event',async (req,res)=>{
  const {body} = req
  console.log('CM event received')
  console.log(body)
  res.status(200).send('received')
})

export default router;
