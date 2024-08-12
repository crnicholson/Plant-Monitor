#include "secrets.h" // Put your WiFi credentials in this file.
#include <HTTPClient.h>
#include <LoRa.h>
#include <SPI.h>
#include <WiFi.h>

// Enables.
#define DEVMODE
#define FAST_LORA

// LoRa, following factors tuned for range.
#define FREQUENCY 915E6     // Frequency of the LoRa module. 433E6 needs a ham radio license in the US.
#define SYNC_WORD 0x40      // Sync word, or password for the communication.
#define SPREADING_FACTOR 10 // Spreading factor of the LoRa communication. Learn more here: https://forum.arduino.cc/t/what-are-the-best-settings-for-a-lora-radio/449528.
#define BANDWIDTH 62.5E3    // Bandwidth of the LoRa.
#define PACKET_FREQUENCY 30 // How many packets of data per hour?

// Pins.
#define SS_PIN 5
#define RESET_PIN A0
#define DIO0_PIN A1
#define LED 7 // SCK uses pin 13.

// Other.
#define SERVER "https://plant.cnicholson.hackclub.app" // URI of the server.
#define BAUD_RATE 115200                               // Baud rate for serial monitor.

// Vars.
long rxCount;

struct data {
  float soilHumidity, airHumidity, temperature, pressure, volts;
  long deviceID, txCount, frequency;
  bool requestRSSI;
} receivedData;

void setup() {
#ifdef DEVMODE
  while (!Serial.begin(BAUD_RATE)) {
    longBlink(LED);
  }
  Serial.println("Plant monitoring system, v1.0.");
  Serial.println("Connecting");
#endif

  WiFi.begin(SSID, PASS);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
#ifdef DEVMODE
    Serial.print(".");
#endif
  }

#ifdef DEVMODE
  Serial.print("\nConnected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
#endif

  LoRa.setPins(SS_PIN, RESET_PIN, DIO0_PIN); // Has to be before LoRa.begin().

  if (!LoRa.begin(FREQUENCY)) {
#ifdef DEVMODE
    Serial.println("Starting LoRa failed!");
#endif
    while (1) {
      longBlink(LED);
    }
  }

#ifndef FAST_LORA
  LoRa.setSyncWord(SYNC_WORD);               // Defined in settings.h.
  LoRa.setSpreadingFactor(SPREADING_FACTOR); // Defined in settings.h.
  LoRa.setSignalBandwidth(BANDWIDTH);        // Defined in settings.h.
  LoRa.crc();                                // Checksum for packet error detection.
#endif

#ifdef FAST_LORA
  LoRa.setSyncWord(SYNC_WORD); // Defined in settings.h.
  LoRa.setSpreadingFactor(7);
  LoRa.setSignalBandwidth(250000);
  LoRa.crc(); // Checksum for packet error detection.
#endif

#ifdef DEVMODE
  Serial.println("LoRa initialized, starting in 1 second.");
#endif

  delay(1000);
}

void loop() {
  int packetSize = LoRa.parsePacket(); // Parse packet.

  if (packetSize > 0) {
    shortBlink(LED);

    byte receivedBytes[sizeof(receivedData) * 2]; // Array to hold received encoded bytes.
    LoRa.readBytes(receivedBytes, packetSize);

    // Decode the received data.
    for (int i = 0; i < sizeof(receivedData); i++) {
      receivedData[i] = hammingDecode(receivedBytes[i]);
    }

    rxCount++;

    // Check if the packet is a valid packet.
    if (sizeof(receivedData) == packetSize / 2) {
      shortBlink(LED);
      if (WiFi.status() == WL_CONNECTED) {
        WiFiClient client;
        HTTPClient http;

        http.begin(client, serverName + "/add-data");

        http.addHeader("Content-Type", "application/json");

        JsonDocument doc;
        doc["soilHumidity"] = receivedData.soilHumidity;
        doc["airHumidity"] = receivedData.airHumidity;
        doc["temperature"] = receivedData.temperature;
        doc["pressure"] = receivedData.pressure;
        doc["deviceID"] = receivedData.deviceID;
        doc["volts"] = receivedData.volts;
        doc["txCount"] = receivedData.txCount;
        doc["rxCount"] = rxCount;
        doc["frequency"] = receivedData.frequency;

        String requestBody;
        serializeJson(doc, requestBody);

        int httpResponseCode = http.POST(requestBody);

#ifdef DEVMODE
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
#endif

        http.end(); // Free resources.

        if (recievedData.requestRSSI) {
          LoRa.beginPacket();
          LoRa.write((byte *)&receivedData.deviceID, sizeof(long));
          LoRa.write((byte *)&LoRa.packetRssi(), sizeof(long));
          LoRa.endPacket(); // Don't use async send. This also sends the data.
        }
      } else {
#ifdef DEVMODE
        Serial.println("WiFi Disconnected.");
#endif
        while (1) {
          longBlink(LED);
        }
      }
    }
  }
}

void shortBlink(int pin) {
  digitalWrite(pin, HIGH);
  delay(100);
  digitalWrite(pin, LOW);
  delay(100);
}

void longBlink(int pin) {
  digitalWrite(pin, HIGH);
  delay(1000);
  digitalWrite(pin, LOW);
  delay(1000);
}

// Function to decode Hamming(7,4) code and correct single-bit errors.
byte hammingDecode(byte encoded) {
  byte p1 = (encoded >> 6) & 0x1;
  byte p2 = (encoded >> 5) & 0x1;
  byte p3 = (encoded >> 4) & 0x1;
  byte d1 = (encoded >> 3) & 0x1;
  byte d2 = (encoded >> 2) & 0x1;
  byte d3 = (encoded >> 1) & 0x1;
  byte d4 = (encoded >> 0) & 0x1;

  // Calculate syndrome bits.
  byte s1 = p1 ^ d1 ^ d2 ^ d4;
  byte s2 = p2 ^ d1 ^ d3 ^ d4;
  byte s3 = p3 ^ d2 ^ d3 ^ d4;

  // Determine error position.
  byte errorPos = (s3 << 2) | (s2 << 1) | s1;

  // Correct the error if needed.
  if (errorPos > 0 && errorPos <= 7) {
    encoded ^= (1 << (7 - errorPos));
  }

  // Return the original 4 data bits.
  return (d1 << 3) | (d2 << 2) | (d3 << 1) | d4;
}