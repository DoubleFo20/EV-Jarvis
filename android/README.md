# EV-Jarvis Android Auto MVP

This is a separate native Android phone companion and Android for Cars POI surface. It does not replace the existing Next.js SSR application.

The current bounded MVP deliberately uses:

- manual/local vehicle state (SOC, range, destination, timestamp, and source);
- an explicit static/demo charging fallback with `DEMO_STATIC_FALLBACK` and `UNVERIFIED_STATIC` labels;
- Android for Cars `PlaceListMapTemplate` for charging POIs;
- external navigation handoff through the approved Android navigation intent boundary.

It does not claim Deepal S05 telemetry, direct vehicle control, payment behavior, live station availability, or provider coverage.

## Local commands

From this directory, with `JAVA_HOME` pointing at JDK 17 and `ANDROID_SDK_ROOT` pointing at the local SDK:

```powershell
gradle wrapper --gradle-version 8.10.2
./gradlew.bat testDebugUnitTest
./gradlew.bat assembleDebug
```

The emulator/DHU and real-device/vehicle checks are separate evidence layers and are not implied by a local assemble or unit-test result.
