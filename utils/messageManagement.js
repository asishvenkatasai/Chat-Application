var mongoClient = require("mongodb").MongoClient;

var messageArr = [];
function postMessage(obj) {
    // messageArr.push(obj);
    mongoClient.connect("mongodb://localhost:27017/", { useUnifiedTopology: true }, (err, dbHost) => {
        if (err)
            console.log("eroor connecting to server");
        else {
            db = dbHost.db("slDb");
            db.collection("messages", (err, coll) => {
                if (err) {
                    console.log("error connection to collections");
                }
                else {
                    coll.insertOne(obj);
                }
            })
        }
    })
}

function getAllMessages(obj, messageArray) {
    console.log(222);
    console.log(obj);

    mongoClient.connect("mongodb://localhost:27017/", { useUnifiedTopology: true }, (err, dbHost) => {
        if (err)
            console.log("eroor connecting to server");
        else {
            db = dbHost.db("slDb");
            db.collection("messages", (err, coll) => {
                if (err) {
                    console.log("error connection to collections");
                }
                else {
                    coll.find({ roomName: obj.roomName }, { message: 1, userName: 1, _id: 0, roomName: 0 }).toArray((err, data) => {
                        if (err) {
                            console.log("error");
                            messageArray({ error: err })
                        }
                        else {
                            console.log("data recovered");
                            console.log(data);
                            messageArray(data);
                            /*var messageArray =data.map(item=>item);
                            console.log(messageArray);*/

                        }
                    })
                }
            })
        }
    })
}
module.exports = { postMessage: postMessage, getAllMessages };