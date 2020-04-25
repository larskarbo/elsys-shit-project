var SerialPort = require("serialport");

var io = require('socket.io')();


var port = new SerialPort('/dev/ttyUSB0', { autoOpen: false });

port.open(function (err) {
  if (err) {
    return console.log('Error ved åpning av port: ', err.message);
  }
});

port.on('open', function () {
  console.log('Port opened successfully')
});

io.on('connection', function (socket) {
  socket.emit('event', {
    melding: 'Hei dette er en initiell melding fra raspberry pi om at ting fungerer'
  });

  // hver gang det kommer data på porten
  port.on('readable', function () {
    // emmiter en pakke 'a' med dataen
    socket.emit('a', port.read().toString());
  });
});

io.listen(3000);