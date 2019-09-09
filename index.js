 let express = require('express')
 let app = express();
 let http = require('http');
 let server = http.Server(app);

 let socketIO = require('socket.io');
 let io = socketIO(server);

 const port = process.env.PORT || 3000;
 const Bot = require('./bot/bot.js');
 const bot = new Bot();
 let users = [];
 io.on('connection', (socket) => {
     console.log('user connected');
      socket.on('user-name', (username) => {  
        if (username)     {
        users.indexOf(username) === -1 ? users.push(username) : console.log("This item already exists");
        io.emit('user-name', users);
        }
    });
     socket.on('new-message', (message) => {
          message.text = message.text ? message.text.trim() : '';
         if (message.text.substring(0, 7).toLowerCase() === '/stock=') {
             const command = message.text.substring(7, message.text.length);
             bot.getMessage(command, function (returnMsg) {
                 io.emit('new-message', returnMsg);
             });
         }
         io.emit('new-message', message);

     });
 });

 server.listen(port, () => {
     console.log(`started on port: ${port}`);
 });