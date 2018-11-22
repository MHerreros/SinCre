    
    //// INICIALIZAR LCD ////
    #include <LiquidCrystal.h>      // include the library code
    const int rs = 12, en = 11, d4 = 5, d5 = 4, d6 = 6, d7 = 7;    // initialize the library by associating any needed LCD interface pin with the arduino pin number it is connected to
    LiquidCrystal lcd(rs, en, d4, d5, d6, d7);
    
    //// INICIALIZAR ENCODER ////  
    volatile int contador = 0;   // Variable entera que se almacena en la RAM del Micro
    int velMaxMot=34;

#include <ModbusSlave.h>

Modbus slave(1, 9); // [stream = Serial,] slave id = 1, rs485 control-pin = 8
bool on = false;

void interrupcion0()    // Funcion que se ejecuta durante cada interrupion
  {contador++;}           // Se incrementa en uno el contador
  
void setup() {
    //// SETEO DE PINES //// 
    pinMode(11,OUTPUT);
    pinMode(12,OUTPUT);
    pinMode(7,OUTPUT);
    pinMode(5,OUTPUT);
    pinMode(4,OUTPUT);
    pinMode(3, OUTPUT);
    pinMode(6, OUTPUT);
    pinMode(9, OUTPUT);
    
    //// SETEO DE LCD ////
    lcd.begin(16, 2);   // set up the LCD's number of columns and rows:
    
   slave.cbVector[CB_READ_REGISTERS] = ReadAnalogIn;
    //// SETEO DE ENCODER ////  
    Serial.begin(9600);
    attachInterrupt(0,interrupcion0,RISING);  // Interrupcion 0 (pin2) 
 }

void loop() {
  slave.poll();
    //// LECTURA POTENCIOMETROS ////
    int PotLim=analogRead(0);   //Limitador
    int PotAc=analogRead(1);    //Acelerador
    double VelAc=map(PotAc,0,1024,0,velMaxMot);
    
    //// CÁLCULO VELOCIDAD REAL ////
    delay(999);   // Retardo de casi 1 segundo
    int VelReal = (contador*3*0.2121);    //*0.2121 = Distancia recorrida por vuelta
    contador = 0;
    int VRealPWM = map(VelReal,0,velMaxMot,0,255);
    analogWrite(9,VRealPWM);    
      
    //// IMPRIME VELOCIDADES EN LCD ////
    int VelLimit=map(PotLim,0,1024,0,velMaxMot);
    lcd.clear();
    lcd.print("LIMIT "+String(VelLimit)+" m/min");
    lcd.setCursor(0,1);
    lcd.print("REAL  "+String(VelReal)+" m/min");
    lcd.setCursor(0,0);

    //// COMPARACION Y REDUCCION DE VELOCIDAD DEL MOTOR ////
    int PotMot;
    int PWM;
    if (VelAc>VelLimit) {
        PWM=map(PotLim,0,1024,0,255);
        analogWrite(3,PWM);
        PotMot=PotLim;
    }
    else {
        PWM=map(PotAc,0,1024,0,255);
        analogWrite(3,PWM);
        PotMot=PotAc;
    }
    //delay(500);
        
    //// IMPRESION EN SERIAL DE LAS VARIABLES ////
    Serial.println("VRealPWM " + String(VRealPWM) +"VelLimit " + String(VelLimit) +"  "+"VelReal " + String(VelReal) + "  " + "PotLim " + String(PotLim) +" " + "PotAc " + String(PotAc)+"  " + "PotMot " + PotMot + "  " + "Condicion " + String(VelReal>VelLimit)); 
    Serial.println(pulseIn(9,HIGH));
    //Serial.println(contador*3); // Como son dos interrupciones por vuelta (contador * (60/20))
    //Serial.println(" RPM");    //  El numero 2 depende del numero aspas de la helice del motor en prueba
    //Serial.println(VelReal);
    //Serial.println(" m/min");
    //Serial.println(PotAc);
    //Serial.println(" m/min");
    //diametro rueda 6.75 cm
    //circunferencia rueda = pi*6.75= 21.21 cm = 0.2121 m
    //1 RPM =0.2121 m
    //Serial.println(VelLimit);
}
uint8_t ReadAnalogIn(uint8_t fc, uint16_t address, uint16_t length) {
        // write registers into the answer buffer
   for (int i = 0; i < length; i++) {
    int value = digitalRead(9);

      slave.writeRegisterToBuffer(0, value);
    }
    return STATUS_OK;
}
