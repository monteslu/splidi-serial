'use strict';

var util = require('util');
var stream = require('stream');

var NOTE_ON = 0x90;



function SplidiSerialPort(options) {
  var self = this;

  options = options || {};


  if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess({
          sysex: false
      }).then(function(midiAccess){


        var inputs = Array.from(midiAccess.inputs.values());
        console.log('inputs', inputs);

        inputs.forEach(function(input){
          if(!options.inputId){
            self.input = input;
            return false;
          }
          else if(options.inputId == input.id){
            self.input = input;
            return false;
          }
        });

        if(self.input){
          self.input.onmidimessage = function(message) {
            var rawdata = message.data;
            console.log('raw MIDI input', rawdata);

            // convert midi message into a byte
            if(rawdata.length === 3){
              self.emit('data', new Buffer([ rawdata[1] | (rawdata[2] << 7) ]));
            }
          };
        }

        var outputs = Array.from(midiAccess.outputs.values());
        console.log('outputs', outputs);

        outputs.forEach(function(output){
          if(!options.outputId){
            self.output = output;
            return false;
          }
          else if(options.outputId == output.id){
            self.output = output;
            return false;
          }
        });

        if(self.output || self.input){
          self.emit('open');
        }


      },function(error){
        return self.emit('error', error);
      });
  } else {
    return self.emit('error', new Error('MIDI not supported'));
  }


}

util.inherits(SplidiSerialPort, stream.Stream);


SplidiSerialPort.prototype.open = function (callback) {
  this.emit('open');
  if (callback) {
    callback();
  }

};



SplidiSerialPort.prototype.write = function (data, callback) {
  console.log('send', data);
  var self = this;
  if(data && self.output){
    if(!Buffer.isBuffer(data)){
      data = new Buffer(data);
    }

    data.forEach(function(value){
      self.output.send(new Buffer([NOTE_ON, value & 0x7F, (value >> 7) & 0x7F]));
    });

    if(callback){
      callback();
    }

  }



};



SplidiSerialPort.prototype.close = function (callback) {
  console.log('closing');

  if(this.input){
    this.input.onmidimessage = null;
    this.input.close();
  }

  if(this.output){
    this.output.close();
  }

  if(callback){
    callback();
  }

};

SplidiSerialPort.prototype.flush = function (callback) {
  console.log('flush');
  if(callback){
    callback();
  }
};

SplidiSerialPort.prototype.drain = function (callback) {
  console.log('drain');
  if(callback){
    callback();
  }
};


module.exports = {
  SerialPort: SplidiSerialPort
};
