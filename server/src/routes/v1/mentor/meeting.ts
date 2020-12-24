import { Request, Response , Router } from "express";
import {meetingSchema, meetingSchemaToPut} from "../../../validations"
//@ts-ignore
import { Student, Mentor, MentorStudent, Meeting, Class} from "../../../models";
import { IDashboard, IMeeting } from "../../../types";
import transporter from "../../../mail";
const ical = require('ical-generator');


const router = Router();

const sendMeetingEmail = async (
    to: string,
    meeting: any
) => {
    const cal = ical()
    const event = cal.createEvent({
        start: meeting.date,
        end: new Date((new Date(meeting.date)).getTime() + 1000 * 60 * 60),
        organizer: {name: meeting.studentName ,email: meeting.studentEmail},
        location: meeting.place,
    });
    event.alarms([
        { type: 'display', trigger: 60 * 60 * 24 },
        { type: 'audio', trigger: 60 * 30 },
    ])
    const message = {
        from: process.env.EMAIL_USER,
        to: to === 'mentor' ? meeting.mentorEmail : meeting.studentEmail,
        subject: 'Scale Up Velocity - Mentors Project Meeting',
        text: `Hi! you invited to a meeting in part of your mentors project with ${to === 'mentor' ? meeting.studentName +' '+meeting.studentEmail : meeting.mentorName+' '+meeting.mentorEmail}`,
        alternatives: [{
            contentType: "text/calendar",
            content: cal.toString(),
        }]
    }
    const info = await transporter.sendMail(message)
    return info
};

// Refer to the Node.js quickstart on how to setup the environment:
// https://developers.google.com/calendar/quickstart/node
// Change the scope to 'https://www.googleapis.com/auth/calendar' and delete any
// stored credentials.
// function sendEvent(meeting: any) {
//     var event = {
//         'summary': meeting.title,
//         'location': meeting.place,
//         'description': 'Scale Up Velocity - Mentors Project Meeting',
//         'start': {
//           'dateTime': meeting.date,
//           'timeZone': 'Asia/Jerusalem',
//         },
//         'end': {
//           'dateTime': new Date((new Date(meeting.date)).getTime() + 1000 * 60 * 60),
//           'timeZone': 'Asia/Jerusalem',
//         },
//         'recurrence': [
//           'RRULE:FREQ=DAILY;COUNT=2'
//         ],
//         'attendees': [
//           {'email': meeting.studentEmail},
//           {'email': meeting.mentorEmail},
//         ],
//         'reminders': {
//           'useDefault': false,
//           'overrides': [
//             {'method': 'email', 'minutes': 24 * 60},
//             {'method': 'popup', 'minutes': 0},
//           ],
//         },
//       };
      
//       calendar.events.insert({
//         auth: auth,
//         calendarId: 'primary',
//         resource: event,
//       }, function(err, event) {
//         if (err) {
//           console.log('There was an error contacting the Calendar service: ' + err);
//           return;
//         }
//         console.log('Event created: %s', event.htmlLink);
//       });
    
// }
  

// get pair meets:
router.get('/:id', async (req: Request, res: Response) => {
    try{
        const classTableData:IDashboard[] = await MentorStudent.findOne({
            where:{id:req.params.id},
            include:[
                {
                    model: Student,
                },
                {
                    model: Mentor,
                },
                {
                    model: Meeting,
                }
            ]
        });
        res.json(classTableData);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
})

// post new meet:
router.post('/', async (req: Request, res: Response) => {
    try{ 
        const {error} = meetingSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.message });
        let response: any[] = [];
        try {
            console.log(req.body)
          await sendMeetingEmail('mentor', req.body)
          await sendMeetingEmail('student',req.body)   
        } catch (error) {
            response[1] = "email not sent : " + error.message
        }
        const newMeeting = req.body
        delete newMeeting.studentEmail
        delete newMeeting.mentorEmail
        delete newMeeting.studentName
        delete newMeeting.mentorName
        response[0] = await Meeting.create(newMeeting);
       
        res.json(response);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
})

// update meeting
router.put('/:id', async (req: Request, res: Response) => {
    try{
        const { error } = meetingSchemaToPut.validate(req.body);
        if (error) return res.status(400).json(error);
        const updated = await Meeting.update(req.body, {
            where: { id: req.params.id },
        });
  if (updated[0] === 1) return res.json({ message: "Meeting updated" });
  res.status(404).json({ error: "Meeting not found" });

    }catch(err){
        res.status(500).json({ error: err.message });
    }
})

// delete meeting
router.patch("/delete", async (req, res) => {
    try {
      const {meetingtId} = req.body;
      const deleted: any = await Meeting.destroy({
        where: { id : meetingtId },
      });
      if (deleted) return res.json({ message: "Meeting deleted" });
      return res.status(404).json({ error: "Meeting not found" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


module.exports = router;