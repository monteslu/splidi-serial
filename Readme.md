splidi-serial
=============

A virtual [node-serialport](https://github.com/voodootikigod/node-serialport) implementation that uses [Web MIDI API](https://webaudio.github.io/web-midi-api/) as the transport.


# why SPLIDI ?

The Web MIDI API only allows actual MIDI protocol data to be sent to and received from MIDI devices.  In order to use the protocol as a transport for any type of binary data, we need to split each byte into pieces to fit into MIDI packets. Split+MIDI = SPLIDI

# splidiSerialPort

Use web midi to send/receive data to a connected MIDI physical device:

## using Echo demo sketch

Write the examples/SplidiEcho arduino sketch to microcontroller with a 32u4 chip such as an Arduion Leonardo or Micro

From a browser:

```js
var splidiSerialPort = require('splidi-serial').SerialPort;

//create the splidi serialport and optionally specify MIDI device IDs
var serialPort = new splidiSerialPort({
  // OPTIONAL inputId : 'xxxxxxx',
  // OPTIONAL ouputId : 'xxxxxxx'
});

serialPort.on('open', function(){
  //send some random bytes
  serialPort.write(new Buffer([234, 15, 0, 127]));
});

serialPort.on('data', function(data){
  console.log('data recieved', data);
});

```



## using StandardFirmataSplidi.ino

```js
var splidiSerialPort = require('splidi-serial').SerialPort;
var firmata = require('firmata');


//create the splidi serialport and optionally specify MIDI device IDs
var serialPort = new splidiSerialPort({
  inputId : '469915632',
  ouputId : '-1841044055'
});

//use the virtual serial port to send a firmata device
var board = new firmata.Board(serialPort, function (err, ok) {
  if (err){ throw err; }
  //light up a pin
  board.digitalWrite(13, 1);
});

```


