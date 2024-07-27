#include "misc.h"

uint64_t runtimeVar;

long lastMillis;

uint64_t getRuntime() {
  if (millis() < 100000000 && lastMillis > 100000000) {
  } else {
    difference = millis() - lastMillis;
  }
  runtimeVar += difference;
  lastMillis = millis();
}