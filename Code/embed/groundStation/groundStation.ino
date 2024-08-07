#include "secrets.h" // Put your WiFi credentials in this file.
#include "settings.h"
#include <HTTPClient.h>
#include <LoRa.h>
#include <SPI.h>
#include <WiFi.h>

#define SERVER "https://plant.cnicholson.hackclub.app/" // URI of the server.
#define BAUD_RATE 115200                                // Baud rate for serial monitor.

// LoRa, following factors tuned for range.
#define FREQUENCY 915E6     // Frequency of the LoRa module. 433E6 needs a ham radio license in the US.
#define SYNC_WORD 0x40      // Sync word, or password for the communication.
#define SPREADING_FACTOR 10 // Spreading factor of the LoRa communication. Learn more here: https://forum.arduino.cc/t/what-are-the-best-settings-for-a-lora-radio/449528.
#define BANDWIDTH 62.5E3    // Bandwidth of the LoRa.
#define PACKET_FREQUENCY 30 // How many packets of data per hour?

int rxCount;

struct data {
  float soilHumidity, airHumidity, temperature, pressure;
  int deviceID, txCount;
} receivedData;

void setup() {
#ifdef DEVMODE
  Serial.begin(BAUD_RATE);
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
    LoRa.readBytes((byte *)&receivedData, sizeof(receivedData)); // Receive packet and put it into a struct.
    rxCount++;

    // Check if the packet is a valid packet.
    if (sizeof(receivedData) == packetSize) {
      shortBlink(LED);
      if (WiFi.status() == WL_CONNECTED) {
        WiFiClient client;
        HTTPClient http;

        http.begin(client, serverName);

        struct data {
          float soilHumidity, airHumidity, temperature, pressure;
          int deviceID, txCount;
        } receivedData;

        http.addHeader("Content-Type", "application/json");
        int httpResponseCode = http.POST("{\"\":\"\",\"sensor\":\"BME280\",\"value1\":\"24.25\",\"value2\":\"49.54\",\"value3\":\"1005.14\"}");

#ifdef DEVMODE
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
#endif

        http.end(); // Free resources.
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