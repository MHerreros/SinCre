#include <ModbusSlave.h>

Modbus slave(1, 9); // [stream = Serial,] slave id = 1, rs485 control-pin = 8
bool on = false;
void setup() {

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
      slave.writeRegisterToBuffer(0, 150);
    }
    return STATUS_OK;
}
