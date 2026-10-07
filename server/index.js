const express = require('express');
const cors = require('cors');
const crypto = require("crypto"); 

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
const sessions = new Map();

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'NovaMovies API is running' });
});
app.post("/api/login",(req,res)=>{
  const{userid,deviceName} = req.body;

if(!userid|| !deviceName){
  return res.status(400).json({
    message:"userid and deviceName is required",
  });
}
const existing = sessions.get(string(userid));
if(existing){
  return res.status(409).json({
    activeSession:true,
    session:existing,
    message:"active session is alredy exists",
  });
}
const session = {
  sessionId:crypto.randomUUID(),
  userid:String(userid),
  deviceName,
  loginAt:new Date().tolSOString(),
};
sessions.set(String(userid),session);
res.json({
  activeSession:false,session,
  message:"login successful",
});
});
app.post("/api/session/takeover",(req,res)=>{
  const{userid,deviceName} = req.body;
if(!userid||!deviceName){
   return res.status(400).json({
    message:"userid and deviceName are required",
  });
}
const oldSession = session.get(id)||null;
const newSession = {
  sessionId:crypto.randomUUID(),
  userid:String(userid),
  deviceName,
  loginAt:new Date().tolSOString(),
};
sessions.set(String(userid),newSession);
res.json({
  success:true,
  previousSession:oldSession,
  messages:"previous session invaildated",
});
});
app.get("/api/session/:userid/:sessionid",(req,res)=>{
  const{userid,sessionid} = req.params;
  const session = sessions.get(String(userid));
  if(!session||session.sessionid !==sessionid){
    return res.status(401).json({
      valid:false,
      messages:"session is no longer valid",
    });
  }
  res.json({
    valid:true,
    session,
  });
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});