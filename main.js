const http = require("http");
const fs = require("fs");
const ws = require("socket.io");
const express = require("express");
const app = express();
app.use('/', express.static(__dirname + '/view'));

const ss = http.createServer(app);
const server = ws.listen(ss);
var clients = [];
var messages = {date:null,msgArr:[]};
server.on("connection", (client) => {
    // console.log(server.clients().json);
    if (clients.find((cl) => cl.id == client.id) == undefined) {
        client.on("leaving",()=>{
            client.disconnect();
        clients.splice(clients.indexOf(client),1);
    });

        clients.push(client);
        server.clients().add(client);
        client.send("welcome to the chat");
        client.emit("chat_messages", messages.msgArr);
        client.on("chat_message", (msg) => {
            messages.msgArr.push(msg);
            messages.date = new Date();
            if(messages.msgArr.length == 500){
                messages.msgArr = [];
            }
            server.sockets.emit("chat_message",msg);
        });
        
    }
});

ss.listen(4444, () => {
    console.log("Server Started ... ");
})