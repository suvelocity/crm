import {Student,MentorStudent,Meeting} from "./models";
const Nexmo = require("nexmo");
const { Op } = require("sequelize");

const nexmo = new Nexmo({
    apiKey: process.env.NEXMO_API_KEY,
    apiSecret: process.env.NEXMO_API_SECRET,
  });
const from = 'YOUR-MENTOR';

    setInterval(async() => {
        const meeting = await Meeting.findAll({
            where: { 
                date:{
                    [Op.between]: [new Date(Date.now() + 30*60*1000) , new Date(Date.now() + 60*60*1000)],
                }
            },
            include:[
                {
                    model:MentorStudent,
                    attributes: ["studentId","id"],
                    include: [
                        {
                            model:Student,
                            attributes: ["phone"]
                        }
                    ]
                }
            ]
        })
        const Aftermeeting = await Meeting.findAll({
            where: { 
                date:{
                    [Op.between]: [new Date(Date.now() - 90*60*1000) , new Date(Date.now() - 60*60*1000)],
                }
            },
            include:[
                {
                    model:MentorStudent,
                    attributes: ["studentId","id"],
                    include: [
                        {
                            model:Student,
                            attributes: ["phone"]
                        }
                    ]
                }
            ]
        })
        if(meeting[0]){
            meeting.forEach((meet)=>{
                const to = `972${meet.MentorStudent.Student.phone.slice(1)}`;
                const text = `DONT FORGET! You have an appointment with your mentor in ${meet.date.toLocaleTimeString().slice(0,5)}`;
                nexmo.message.sendSms(from, to, text,(err,res)=>{
                    if(err){
                        console.log("err",err);
                    }else{
                        console.log("good",res);
                    }
                });
            })
            process.send(meeting[0].MentorStudent.Student.phone)
        }
        if(Aftermeeting[0]){
            Aftermeeting.forEach((meet)=>{
                const to = `972${meet.MentorStudent.Student.phone.slice(1)}`;
                const text = `How was the meeting? Do not forget to update on "url"`;
                nexmo.message.sendSms(from, to, text,(err,res)=>{
                    if(err){
                        console.log("err",err);
                    }else{
                        console.log("good",res);
                    }
                });
            })
            process.send(Aftermeeting[0].MentorStudent.Student.phone)
        }
    }, [600000])
