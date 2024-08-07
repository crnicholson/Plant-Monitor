/*
plantMonitor.ino, part of Plant Monitor, to monitor plant water levels.
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

#include "blink.h"
#include "bme280.h"
#include "cap.h"
#include "i2c_scan.h"
#include "lora.h"
#include "misc.h"
#include "settings.h"
#include <SimpleSleep.h>

SimpleSleep Sleep;

struct data packet;

void setup() {
  pinMode(LED, OUTPUT);
  digitalWrite(LED, LOW);

  shortBlink(LED); // Show startup.
  shortBlink(LED);

#ifdef DEVMODE
  SerialUSB.begin(BAUD_RATE);
  while (!SerialUSB)
    longBlink(LED);
  Serial.println("Plant monitoring system, v1.0.");
#endif

  loraSetup();
  i2cScan();

#ifdef DEVMODE
  Serial.println("Everything has intialized and the program starts in one second.");
#endif
}

void loop() {
  packet.txCount++;
  packet.airHumidity = BME280humidity();
  packet.temperature = BME280temperature();
  packet.pressure = BME280pressure();
  packet.runtime = getRuntime();
  packet.soilHumidity = getWaterLevel();
  packet.volts = getVoltage();

  sendData(packet);

  Sleep.deeplyFor((60 / PACKET_FREQUENCY) * 60000); // Sleep the MCU for the specified time between packets.
}
