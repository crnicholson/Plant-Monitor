#pragma once

#include "settings.h"
#include <stdint.h>

struct data {
  float soilHumidity, airHumidity, temperature, pressure;
  int deviceID = DEVICE_ID, txCount;
};

extern struct data packet;