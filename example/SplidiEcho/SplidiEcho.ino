
#include "MIDIUSB.h"


void setup() {
  Serial.begin(57600);
  Serial.println("hello from midi device");
}



void sendByteOverMidi(byte data) {
  midiEventPacket_t event = {0x09, 0x90, data & 0x7F, (data >> 7) & 0x7F};
//  Serial.println("sending event");
  MidiUSB.sendMIDI(event);
  MidiUSB.flush();
}


void loop() {
  //MidiUSB.accept();
  //delayMicroseconds(1);
  midiEventPacket_t rx;
  do {
    rx = MidiUSB.read();
    if (rx.header != 0) {
      Serial.println(rx.header);
      Serial.println(rx.byte1);
      Serial.println(rx.byte2);
      Serial.println(rx.byte3);

      //combine the byte
      sendByteOverMidi(rx.byte2 | (rx.byte3 << 7) );

    }
  } while (rx.header != 0);
}
