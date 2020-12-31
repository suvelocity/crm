export default (
  userName:string,
  password:string
)=>`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SteamSales</title>
  <style>
    p {
        white-space: wrap;
      }
  </style>
</head>
<body>
  <p>     
    Hello,
    Welcome to our program! <br/>
    In the upcoming course, you will be using the <a href="http://35.239.15.221"  >ChallengeMe</a> system.<br/>
    It is a system for submitting tasks, learning and more.<br/>
    Provided below are your username and password for access into the system.<br/>
    <br/>
    user: ${userName}<br/>
    password: ${password}<br/>
    <br/>
    Good luck! we hope to see you soon.<br/>
    suvelocity<br/>
  </p>
</body>`