/*
lora.cpp, part of Plant Monitor, to monitor plant water levels.
Copyright (C) 2024 Charles Nicholson

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

#include "lora.h"

void loraSetup() {
  LoRa.setPins(CS, LORA_RESET, DIO0);

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
}

void sendData(struct data &newPacket) {
  while (LoRa.beginPacket() == 0) {
    delay(10);
  }

  LoRa.beginPacket();

  byte *packetBytes = (byte *)&newPacket;
  for (int i = 0; i < sizeof(newPacket); i++) {
    byte encodedByte = hammingEncode(packetBytes[i]);
    LoRa.write(encodedByte);
  }

  LoRa.endPacket(); // Don't use async send.
  LoRa.end();       // This is supposedly better than LoRa.sleep().
}

byte hammingEncode(byte data) {
  byte p1 = ((data >> 2) & 0x1) ^ ((data >> 1) & 0x1) ^ ((data >> 0) & 0x1);
  byte p2 = ((data >> 3) & 0x1) ^ ((data >> 1) & 0x1) ^ ((data >> 0) & 0x1);
  byte p3 = ((data >> 3) & 0x1) ^ ((data >> 2) & 0x1) ^ ((data >> 0) & 0x1);

  byte hamming = (p1 << 6) | (p2 << 5) | (p3 << 4) | (data & 0xF);
  return hamming;
}

void sendForRSSI() {
  while (LoRa.beginPacket() == 0) {
    delay(10);
  }

  LoRa.beginPacket();
  LoRa.write((byte *)&DEVICE_ID, sizeof(long));
  LoRa.endPacket(); // Don't use async send.
  while (LoRa.parsePacket() < 0) {
    longBlink(LED);
#ifdef DEVMODE
    Serial.println("Sending for RSSI, waiting for response.");
#endif
    long recievedID;
    lora.readBytes((byte *)&recievedID, sizeof(long));
    if (recievedID == DEVICE_ID) {
    } else {
#ifdef DEVMODE
      Serial.println("Received ID does not match the device ID.");
#endif
      longBlink(LED);
    }
  }
}

void receiveRSSI() {
  int packetSize = LoRa.parsePacket(); // Parse packet.

  if (packetSize > 0) {
    LoRa.readBytes(receivedBytes, sizeof(long));
  }
}
