
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var path = require("path");
var http = require("http");
var queryString = require('querystring');
var socketio = require('socket.io');
const server = http.createServer(app);
var io = socketio(server);
var fs = require('fs');
var userObj = require('./utils/userinfo');
var messageObj = require('./utils/messageManagement');

var deleteFlag = false;
const PORT = 3000;


app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.get("/", (req, res) => {
    var fileUrl = path.join(__dirname, "public", "login page.html");
    res.sendFile(fileUrl);
})
app.post('/home', (req, res) => {
    var username = req.body.username;
    var dropselect = req.body.dropdown;
    var temp = queryString.stringify({ username: username, dropdown: dropselect });
    res.redirect('/chat?' + temp);
})
app.get("/chat", (req, res) => {
    var fileUrl = path.join(__dirname, "public", "chat.html");
    res.sendFile(fileUrl);
})
io.on("connection", (socket) => {
    socket.on("joinRoom", (data) => {
        socket.join(data.roomName);
        //console.log(1);
        console.log(data);
        var obj = { username: data.username, message: "new user has joined the room", roomName: data.roomName };
        userObj.newUserJoin(socket.id, data.username, data.roomName);
        messageObj.postMessage(obj);
        socket.emit("welcomeUser", "Welcome to the room");
        //var userArray=userObj.getAllUsers(data.roomName);
        var userArray = [];
        userObj.getAllUsers(data.roomName, (userdata) => {
            // console.log(userdata);
            userArray.push(userdata);
            // console.log(44)
            // console.log(userArray);
            io.to(data.roomName).emit("allUserInfo", userdata);
            socket.to(data.roomName).broadcast.emit("newUserJoinMessage", obj);
        })
        console.log(55);
        console.log(userArray);

    })
    socket.on("disconnect", () => {
        console.log("User left the room");
        userObj.removeUser(socket.id, socket, io);
    })
    socket.on("message", (obj) => {
        console.log("message", obj);
        messageObj.postMessage(obj);
        io.to(obj.roomName).emit("chatMessage", obj);
    })
    socket.on("download", (obj) => {
        console.log(200);
        console.log(obj);
        var messageArray = "";
        messageObj.getAllMessages(obj, (messageData) => {

            for (let i = 0; i < messageData.length; i++) {
                messageArray += ("username:" + messageData[i].username.toString() + " - " + "message:" + messageData[i].message.toString() + "\n");
            }
            console.log(32);
            console.log(messageArray);
            var fileName = messageData[0].roomName.toString();
            fileName += "-message-data.txt";
            // alert("data stored ");
            fs.writeFile(fileName, messageArray, (err) => {
                if (!err) {
                    console.log("data replaced");
                    socket.emit("downloadMessage", fileName);
                }
                else {
                    console.log("ereor" + err);
                }
            })
        });

    })
})
server.listen(PORT, (err) => {
    if (!err) {
        console.log(`running at server ${PORT}`);
    }
})



