
var chatFrom = document.getElementById("chatFrom");
var chatMessage = document.getElementById("txtChatMessage");
var chatMessageDiv = document.getElementById("chatMessageDiv");
var participentsList = document.getElementById('participentsList');
var room = document.getElementById("roomName");
console.log(Qs.parse(location.search));
var username = Qs.parse(location.search, { ignoreQueryPrefix: true }).username;
var roomName = Qs.parse(location.search, { ignoreQueryPrefix: true }).dropdown;
console.log("Username", username);

const socket = io();

socket.emit("joinRoom", { username: username, roomName: roomName });
socket.on("welcomeUser", (msg) => {
  console.log(2);
  console.log(msg);
  chatMessageDiv.innerHTML += msg;
  console.log(50);
  console.log(roomName);
  room.innerHTML+=roomName.toString();
})
socket.on("chatMessage", (obj) => {
  formtMessage(obj);
})

socket.on("allUserInfo", (userArray) => {
  console.log(100);
  console.log(userArray);
  participentsList.innerHTML = "";
  for (var i = 0; i < userArray.length; i++) {
    var liElement = document.createElement("li");
    var user = userArray[i];
    //   console.log(user);
    var liTextcode = document.createTextNode(user);
    liElement.appendChild(liTextcode);
    participentsList.appendChild(liElement);
  }
})
socket.on("downloadMessage", (fileName) => {
  alert("Downloaded into :" + fileName.toString());
})

socket.on("newUserJoinMessage", (obj) => {
  console.log(obj);
  var paraElement = document.createElement('p');
  var str = " " + obj.username + " : " + obj.message;
  var pTextNode = document.createTextNode(str);
  paraElement.appendChild(pTextNode);
  chatMessageDiv.appendChild(paraElement);
})
function formtMessage(obj) {
  var paraElement = document.createElement('p');
  //paraElement.className="bg-primary text-warning";
  paraElement.className="col-10 border rounded m-4 border-color text-dark"
  paraElement.style.color="red";
  
  var today = new Date();
  var time = today.getHours() + ":" + today.getMinutes();
 /* var a=new Date();
  console.log(a);*/
 /* var a=new Date.getTime()
  console.log(a);*/
  var str = time+ " " + obj.username + " : " + obj.message;
  var pTextNode = document.createTextNode(str);
  paraElement.appendChild(pTextNode);
  
  chatMessageDiv.appendChild(paraElement);
  return str;
}

function sendMessageEventHandler() {
  socket.emit("message", { message: chatMessage.value, username: username, roomName: roomName });
}

function downloadChatEventHandler() {
  console.log(56);
  socket.emit("download", { roomName: roomName });
}