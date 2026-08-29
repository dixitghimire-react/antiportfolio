/**
 * Enhanced Security Telemetry & Digital Fingerprint Dispatcher
 * Captures high-accuracy location, device hardware, network ISP, and GPS (if available)
 * and sends an alert report to the administrator's email.
 */

const TARGET_EMAIL = "dixitghi69@gmail.com";
let lastAlertTimestamp = 0;

const getDeviceDetails = () => {
  const ua = navigator.userAgent;
  let os = "Unknown OS";
  if (ua.indexOf("Win") !== -1) os = "Windows";
  else if (ua.indexOf("Mac") !== -1) os = "macOS";
  else if (ua.indexOf("iPhone") !== -1 || ua.indexOf("iPad") !== -1) os = "iOS (Apple iPhone/iPad)";
  else if (ua.indexOf("Android") !== -1) os = "Android Mobile";
  else if (ua.indexOf("Linux") !== -1) os = "Linux";

  let browser = "Unknown Browser";
  if (ua.indexOf("Chrome") !== -1 && ua.indexOf("Edg") === -1) browser = "Google Chrome";
  else if (ua.indexOf("Safari") !== -1 && ua.indexOf("Chrome") === -1) browser = "Apple Safari";
  else if (ua.indexOf("Edg") !== -1) browser = "Microsoft Edge";
  else if (ua.indexOf("Firefox") !== -1) browser = "Mozilla Firefox";

  return {
    os,
    browser,
    platform: navigator.platform || "Unknown",
    screen: `${window.screen?.width || window.innerWidth}x${window.screen?.height || window.innerHeight} (dpr: ${window.devicePixelRatio || 1})`,
    language: navigator.language || "Unknown",
    timeZone: Intl?.DateTimeFormat?.()?.resolvedOptions?.()?.timeZone || "Unknown",
    userAgent: ua,
  };
};

const getGPSCoordinates = () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          accuracy: `${Math.round(pos.coords.accuracy)} meters`,
          isGPS: true,
        });
      },
      () => resolve(null),
      { timeout: 2000, enableHighAccuracy: true, maximumAge: 60000 }
    );
  });
};

const fetchGeoLocation = async () => {
  // Method 1: ipapi.co (High accuracy city & postal resolution)
  try {
    const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (data.city && !data.error) {
        return {
          ip: data.ip || "Unknown",
          city: data.city || "Unknown",
          region: data.region || "Unknown",
          country: data.country_name || data.country || "Unknown",
          postal: data.postal || "N/A",
          isp: `${data.org || data.asn || ''} (${data.network || ''})`.trim() || "Unknown",
          lat: data.latitude,
          lon: data.longitude,
          source: "IP Geolocation Database (ipapi.co)",
        };
      }
    }
  } catch {
    // Fall through to Method 2
  }

  // Method 2: ipwho.is
  try {
    const res = await fetch("https://ipwho.is/", { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        return {
          ip: data.ip || "Unknown",
          city: data.city || "Unknown",
          region: data.region || "Unknown",
          country: data.country || "Unknown",
          postal: data.postal || "N/A",
          isp: data.connection?.isp || data.connection?.org || "Unknown",
          lat: data.latitude,
          lon: data.longitude,
          source: "IP Routing Gateway (ipwho.is)",
        };
      }
    }
  } catch {
    // Fall through to Method 3
  }

  return {
    ip: "Unknown",
    city: "Unknown",
    region: "Unknown",
    country: "Unknown",
    postal: "N/A",
    isp: "Unknown",
    lat: null,
    lon: null,
    source: "Unknown",
  };
};

export const sendSecurityAlert = async ({ enteredPin, attemptCount, isLockout = false }) => {
  const now = Date.now();
  if (!isLockout && now - lastAlertTimestamp < 4000) {
    return;
  }
  lastAlertTimestamp = now;

  try {
    const device = getDeviceDetails();

    // Fetch GPS and IP Geolocation in parallel
    const [gps, geo] = await Promise.all([
      getGPSCoordinates(),
      fetchGeoLocation(),
    ]);

    const activeLat = gps?.lat || geo?.lat;
    const activeLon = gps?.lon || geo?.lon;
    const mapUrl = activeLat && activeLon ? `https://www.google.com/maps?q=${activeLat},${activeLon}` : "N/A";
    const locationType = gps ? `Exact GPS Pin (Accuracy: ${gps.accuracy})` : geo.source;

    const subject = isLockout
      ? `🚨 VAULT LOCKOUT TRIGGERED: 4 Failed Attempts (${geo.city}, ${geo.country})`
      : `⚠️ Unauthorized Vault Attempt: PIN "${enteredPin}" (${geo.city}, ${geo.country})`;

    const payload = {
      _subject: subject,
      "Security Event": isLockout ? "SYSTEM LOCKOUT (4 Failed Attempts)" : "Incorrect PIN Entry",
      "Attempted PIN": enteredPin,
      "Failed Attempt #": `${attemptCount} of 4`,
      "Timestamp": new Date().toLocaleString(),
      "📍 Location": `${geo.city}, ${geo.region}, ${geo.country} (Postal: ${geo.postal})`,
      "🗺️ Google Maps Location": mapUrl,
      "📡 Location Source": locationType,
      "🌐 IP Address": geo.ip,
      "🏢 ISP / Network Provider": geo.isp,
      "📱 Device / OS": `${device.os} (${device.browser})`,
      "🖥️ Screen Resolution": device.screen,
      "🌐 Language / Timezone": `${device.language} / ${device.timeZone}`,
      "User-Agent": device.userAgent,
      _captcha: "false",
      _template: "table",
    };

    await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.warn("Security telemetry dispatch error:", err);
  }
};
