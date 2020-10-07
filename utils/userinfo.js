
var mongoClient = require("mongodb").MongoClient;
var mongo = require("mongodb");
var assert = require("assert");

const users = [];
var messageObj = require('./messageManagement')
function newUserJoin(id, userName, roomName) {
    var user = { id, userName, roomName };
    users.push(user);

    mongoClient.connect("mongodb://localhost:27017/", { useUnifiedTopology: true }, (err, dbHost) => {
        if (err) {
            console.log("error connecting to server");
        }
        else {
            var db = dbHost.db("slDb");
            db.collection("users", (err, coll) => {
                if (err) {
                    console.log("error in finding collection");
                }
                else {
                    coll.insertOne(user);
                }
            })
        }
    })
}

//function getAllUsers(room) {
function getAllUsers(room, returnResult) {

    console.log(room);
    var usersRoom = users.filter(item => item.roomName == room);
    var resultArray = [];
    mongoClient.connect("mongodb://localhost:27017/", { useUnifiedTopology: true }, (err, dbHost) => {
        if (err) {
            console.log("error connecting to server");
        }
        /* else {
         var db = dbHost.db("slDb");
         assert.equal(null,err);
         var coll=db.collection("users",()=>{}).find({roomName:room});
         console.log(5);
         console.log(coll);
         }
     console.log(resultArray);
         */
        var db = dbHost.db("slDb");
        db.collection("users", (err, coll) => {
            if (err) {
                console.log("error in finding collection");
            }
            else {
                coll.find({ roomName: room }, { userName: 1, _id: 1 }).toArray((err, data) => {
                    if (err) {
                        console.log("error");
                        returnResult({ error: err });
                    }
                    else {
                        var userArray = data.map(item => item.userName);
                        returnResult(userArray);
                    }
                })
            }
        })
    })
    return usersRoom;
}


function removeUser(id, socket, io) {

    mongoClient.connect("mongodb://localhost:27017/", { useUnifiedTopology: true }, (err, dbHost) => {
        if (err) {
            console.log("error connecting to server");
        }
        else {
            var db = dbHost.db("slDb");
            db.collection("users", (err, coll) => {
                if (err) {
                    console.log("error in finding collection");
                }
                else {
                    coll.findOneAndDelete({ id: id }, (err, res) => {
                        if (err) {
                            console.log("error in deletion");
                        }
                        else {
                            console.log("deleted one is", res.value);
                            var tempUser = res.value;
                            var obj = { username: tempUser.userName, message: "has left the room", roomName: tempUser.roomName };
                            messageObj.postMessage(obj);
                            socket.to(tempUser.roomName).broadcast.emit("newUserJoinMessage", obj);
                            //var userArray=getAllUsers(tempUser.roomName);
                            var userArray;
                            getAllUsers(tempUser.roomName, (userdata) => {
                                //console.log(userdata);
                                // console.log(userArray);
                                io.to(tempUser.roomName).emit("allUserInfo", userdata);
                            });

                        }
                    })
                }
            })
        }
        return 1;
    })

}

module.exports = { newUserJoin, getAllUsers, removeUser };