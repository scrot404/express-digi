import express from 'express';
import 'dotenv/config';
import logger from "./logger.js";
import morgan from "morgan";

const app = express()

const port = process.env.PORT || 3000

// app.get("/", (req, res) =>{
//     res.send("this is response")
// })

// app.get("/ice-tea", (req, res) =>{
//     res.send("Which ice tea do you want")
// })

// app.get("/twitter", (req, res) =>{
//     res.send("Scrot twitter")
// })


app.use(express.json())

const morganFormat = ":method :url :status :response-time ms"; // Logger

app.use(
    morgan(morganFormat, {
      stream: {
        write: (message) => {
          const logObject = {
            method: message.split(" ")[0],
            url: message.split(" ")[1],
            status: message.split(" ")[2],
            responseTime: message.split(" ")[3],
          };
          logger.info(JSON.stringify(logObject));
        },
      },
    })
  );

let teaData = []
let nextId = 1

// add a tea
app.post('/teas', (req,res) =>{
    const {name, price} = req.body
    const newTea = {id: nextId++, name, price}
    teaData.push(newTea)
    res.status(201).send(newTea)
})

// get all tea
app.get("/teaData", (req, res) =>{
    res.status(200).send(teaData)
})

//get tea with id
app.get("/teaData/:id", (req, res) =>{
    const tea =  teaData.find(t => t.id === parseInt(req.params.id))
    if(!tea){
        return res.status(404).send('tea not Found')
    }
    res.status(200).send(tea)
})

//update tea

app.put('/teas/:id', (req, res) =>{
    const tea =  teaData.find(t => t.id === parseInt(req.params.id))
    if(!tea){
        return res.status(404).send('tea not Found')
    }
    const { name, price } =  req.body
    tea.name = name 
    tea.price = price
    res.status(200).send(tea)
})

//delete tea

app.delete('/teas/:id',(req,res) =>{
const index = teaData.findIndex(t => t.id === parseInt(req.params.id))
    if(index === -1){
        return res.status(404).send('tea not found')

    }

    teaData.splice(index,1)
    return res.status(204).send('Deleted')
})

app.listen(port,() => {
    console.log(`Server is running at ${port}...`)
})