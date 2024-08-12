#pragma once

#include "settings.h"
#include <stdint.h>

struct data {
  float soilHumidity, airHumidity, temperature, pressure, volts;
  long deviceID = DEVICE_ID, txCount, frequency = ((60 / PACKET_FREQUENCY) * 60);
  bool requestRSSI;
};

extern struct data packet;

extern long lastRSSI;