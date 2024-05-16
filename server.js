import route from "./router.js"
import express from "express"
import {connect} from "mongoose"

connect("mongodb+srv://ZeArt:ConfArtXT2106M@cluster0.y7yyszk.mongodb.net/Paris")
.then(function(){
    console.log("connexion mongo réussie")
})
.catch(function(err){
    console.log(new Error(err))
})

// async function connexion(){
//     await connect
// }

const app = express();
const PORT = 1235;

app.use(route)

app.listen(PORT, function(){
    console.log (`server express écoute sur le port ${PORT}`)
})