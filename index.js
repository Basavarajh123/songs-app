
const express =require("express");
const cors =require("cors");
const {open}= require("sqlite");
const sqlite3=require("sqlite3");

const path= require('path');

const dbPath = path.join(__dirname,"songs.db");

const app= express();

app.use(express.json());
app.use(cors())

let database=null;

const initializeDbAndServer=async()=>{
    try{
        database= await open({
            filename:dbPath,
            driver:sqlite3.Database
        })
        app.listen(5002,async()=>{
            console.log("Listening at Port http://localhost:5002")
        })

    }catch(error){
        console.log(`DB Error : ${error.message}`)
    }
   
}

initializeDbAndServer()

app.get("/",(request,response)=>{
    response.send("Welcome to Songs World")
})

app.get("/songs",async(request,response)=>{
    const sqlQuery= `SELECT * FROM songs`

    const data = await database.all(sqlQuery)
    response.send(data)
})

app.post('/add-songs',async(request,response)=>{
    const {songUrl,tumbnalImageUrl}= request.body;
    const checkSongQuery=`SELECT * FROM songs WHERE songUrl="${songUrl}`;
    const data = await database.get(checkSongQuery);
    if (data ===undefined){
        const sqlQuery= `INSERT INTO songs (songUrl,tumbnalImageUrl)
                                VALUES("${songUrl}","${tumbnalImageUrl}");
    
    `;

    await database.run(sqlQuery);
    response.send("Song added successfully");
        
    }else{
        response.status= 400;
        response.send('Song is Already exists')
    }
    
})