import {Router, Request, Response } from 'express'
//@ts-ignore
import {Form} from '../../models'
import {IForm} from '../../types'
import {Sequelize,Op} from 'sequelize'
import axios from 'axios'
require('dotenv').config()
const router= Router()

const {CM_ACCESS,PORT} = process.env
console.log('access', CM_ACCESS,PORT)
if (!CM_ACCESS){
  console.trace( 'ChallengeMe Access Token Missing!')
}
const challengeMe = 'http://35.239.15.221:8080/api/v1'

router.get('/challengeMe', async ( req:Request , res:Response ) => {
  try{
    const {name:query} = req.query
    const url = `${challengeMe}/challenges${query? '?name='+query:''}`
    console.log(query)
    console.log(url)
    const {data} = await axios.get(url,{
      headers:{
        'authorization':CM_ACCESS,
      },
    })
    const challenges = data.map((challenge:any)=>{
      const {id:value,name:label} = challenge
      return {label,value:String(value)}
    }
    ) 
    res.json(challenges)
  }catch(error){
    console.trace(error)
    res.json({status:'error',message:error.message})
  }
})
router.get('/quiz', async ( req:Request , res:Response ) => {
  const {name:query} = req.query
  try{
    const data :IForm[] = await Form.findAll({
      where: { name:{
        [Op.like]:`%${query}%`
      } },
      order: [["createdAt", "DESC"]],
    })
    const forms = data.map((form)=>{
      const {id:value,name:label} = form
      return {label,value:String(value)}
    }
    ) 
    res.json(forms)
  }catch(error){
    console.trace(error)
    res.json({status:'error',message:error.message})
  }
})

export default router