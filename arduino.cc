// konstanter
const int trigPin = 9;
const int echoPin = 10;

// variabler
long duration;
int distance;

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(buzzer, OUTPUT);

  // set baud rate, viktig å ikkje kødde med den her
  // fordi raspberryen må forstå serial
  Serial.begin(9600);
}


void loop() {
  // sett trigPin på lav
  digitalWrite(trigPin, LOW);

  // liten delay her
  delayMicroseconds(2);

  // Sett trigPinen på HIGH i 10 microsekund
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  // Les echoPin, gir lydbølge sin reisetid i microsekunder
  duration = pulseIn(echoPin, HIGH);

  // kalkuler distansen
  distance = duration*0.034/2;

  Serial.println(distance);
}