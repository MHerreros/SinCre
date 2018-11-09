/*
    Modbus slave simple example

    Control and Read Arduino I/Os using Modbus serial connection.

    This sketch show how to use the callback vector for reading and
    controleing Arduino I/Os.

    * Controls digital output pins as modbus coils.
    * Reads digital inputs state as discreet inputs.
    * Reads analog inputs as input registers.

    The circuit: ( see: ./extras/ModbusSetch.pdf )
    * An Arduino.
    * 2 x LEDs, with 220 ohm resistors in series.
    * A switch connected to a digital input pin.
    * A potentiometer connected to an analog input pin.
    * A RS485 module (Optional) connected to RX/TX and a digital control pin.

    Created 8 12 2015
    By Yaacov Zamir

    https://github.com/yaacov/ArduinoModbusSlave

*/

#include <ModbusSlave.h>

// implicitly set stream to use the Serial serialport
Modbus slave(1, 9); // [stream = Serial,] slave id = 1, rs485 control-pin = 8
bool on = false;
void setup() {
    // register one handler functions
    // if a callback handler is not assigned to a modbus command 
    // the default handler is called. 
    // default handlers return a valid but empty replay.
    //slave.cbVector[FC_READ_COILS] = writeDigitlOut;
    //slave.cbVector[FC_READ_DISCRETE_INPUT] = writeDigitlOut;
    //slave.cbVector[CB_READ_REGISTERS] = writeDigitlOut;
    //slave.cbVector[FC_WRITE_COIL] = writeDigitlOut;
    //slave.cbVector[FC_WRITE_REGISTER] = writeDigitlOut;
    //slave.cbVector[FC_WRITE_MULTIPLE_COILS] = writeDigitlOut;
    //slave.cbVector[FC_WRITE_MULTIPLE_REGISTERS] = writeDigitlOut;
    slave.cbVector[CB_READ_REGISTERS] = ReadAnalogIn;
    pinMode(9, OUTPUT);
    // start slave at baud 9600 on Serial
    Serial.begin( 9600 ); // baud = 9600
    slave.begin( 9600 );
}

void loop() {
    // listen for modbus commands con serial port
    slave.poll();
    if (on) digitalWrite(9, HIGH);
}
uint8_t ReadAnalogIn(uint8_t fc, uint16_t address, uint16_t length) {
    
    // write registers into the answer buffer
   for (int i = 0; i < length; i++) {
      slave.writeRegisterToBuffer(0, 90);
    }
    return STATUS_OK;
}
// Handel Force Single Coil (FC=05)
//uint8_t writeDigitlOut(uint8_t fc, uint16_t address, uint16_t length) {
//    on = true;
  //  if (slave.readCoilFromBuffer(0) == HIGH) {
    //    digitalWrite(address, HIGH);
    //} else {
      //  digitalWrite(address, HIGH);
    //}
    //return STATUS_OK;
//}
