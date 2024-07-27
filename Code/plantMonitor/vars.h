#pragma once

#include "settings.h"
#include <stdint.h>

struct data {
  float soilHumidity, airHumidity, temperature, pressure;
  uint64_t runtime;
};

extern struct data packet;