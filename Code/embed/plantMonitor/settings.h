/*
settings.h, part of Plant Monitor, to monitor plant water levels.
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

// Enables
#define DEVMODE         // Enable and disable the serial output.
#define USE_BME         // Enable and disable the BME280.
#define FAST_LORA       // Enable and disable fast LoRa communication, disregarding other LoRa values.
#define CHANGE_TX_POWER // Enable and disable changing the transmit power based on the RSSI.

// Pins.
#define LED 13           // Onboard LED.
#define CS 10            // Chip select for the LoRa module.
#define LORA_RESET 9     // Reset pin of the LoRa module.
#define DIO0 8           // DIO0 pin of the LoRa module.
#define BUTTON1 7        // Extra button for user config.
#define BUTTON2 6        // Extra button for user config.
#define SOIL_FET 5       // FET to turn on the soil sensor.
#define WATER_PIN A0     // Analog pin to read the water level.
#define VOLTMETER_PIN A1 // Analog pin to read the voltage of the battery.

// LoRa, following factors tuned for range.
#define FREQUENCY 915E6     // Frequency of the LoRa module. 433E6 needs a ham radio license in the US.
#define SYNC_WORD 0x40      // Sync word, or password for the communication.
#define SPREADING_FACTOR 10 // Spreading factor of the LoRa communication. Learn more here: https://forum.arduino.cc/t/what-are-the-best-settings-for-a-lora-radio/449528.
#define BANDWIDTH 62.5E3    // Bandwidth of the LoRa.
#define PACKET_FREQUENCY 30 // How many packets of data per hour?

#define DEVICE_ID 1234   // ID of the device, used to identify the device. Do not change this value.
#define DEVICE_PASS 1234 // Do not change this value.

#define GET_RSSI_RATE 1440 // Minutes between getting RSSI checks to lower and raise the power consumption.

// Dynamically change the transmit power based on the RSSI.
#define RSSI_THRESHOLD_HIGH -70 // Strong signal. Getting over this will lower the TX power.
#define RSSI_THRESHOLD_LOW -90  // Weak signal. Getting over this will raise the TX power.
