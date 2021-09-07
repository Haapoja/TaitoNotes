const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./model/user");
const Notes = require("./model/notes");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



const JWT_SECRET = "asdapejf209jecapåcj2jasmd2å";

mongoose.connect("mongodb://localhost:27017/TaitoNotes",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
 
const app = express()
app.use("/", express.static(path.join(__dirname, "static")))
app.use(express.json())

//Login post method
app.post("/api/login", async (req, res) => {
    const { username, password } = req.body
//find user
    const user = await User.findOne({username}).lean()
//checks if user exists
    if(!user){
        return res.json({status: "error", error: "Invalid username/password"})
    }
//compare username to hashed password
    if(await bcrypt.compare(password, user.password)){
        //the username/password combination is successful
        //initiate login
        const token = jwt.sign({ 
            id: user._id, 
            username: user.username 
        }, 
        JWT_SECRET
        )
       
        return res.json({status: "ok", data: token});
      
        
    }

    res.json({ status: "error", error: "Invalid username/password"})
})

//register method
app.post("/api/register", async (req, res)=>{
    console.log(req.body)
    
    const {username, password: plainTextPassword} = req.body
    //check if username is viable
    if(!username || typeof username !== "string"){
        return res.json({
            status: "error", error: "Invalid username"
        })
    }
    //decrypt the password
    const password = await bcrypt.hash(plainTextPassword, 5)
    //create the user
    try{
        const response = await User.create({
            username,
            password
        })
        console.log("user created successfully: ", response)
       
     
    } catch (error){
        if(error.code === 11000){
            //duplicate key
            return res.json({ status: "error", error: "Username already in use"})
        }
        throw error
        
    }

    res.json({ status: "ok" })
    
   
})


// app.post('/post-note', function (req, res) {
//     dbConn.then(function(db) {
//         delete req.body._id; // for safety reasons
//         db.collection('notes').insertOne(req.body);
//     });    
//     res.send('Data received:\n' + JSON.stringify(req.body));
// });

app.post("/post-note", async (req, res)=>{
    const {NoteId, NoteText} = req.body

    try{
        const response = await Notes.create({
            NoteId,
            NoteText
        })
        console.log("Note created successfully: ", response)
       
     
    } catch (error){
        if(error.code === 11000){
            //duplicate key
            return res.json({ status: "error", error: "Username already in use"})
        }
        throw error
        
    }

     res.json({ status: "ok" })
})



app.listen(9999, ()=>{
    console.log("Server up at 9999")
})