/**
 * Advanced Device Model & Security Telemetry Dispatcher
 * Maps exact smartphone and computer model names using Client Hints,
 * WebGL GPU Fingerprinting, and Screen Dimension Profiles (100% Silent).
 */

const TARGET_EMAIL = "dixitghi69@gmail.com";
let lastAlertTimestamp = 0;

// GPU Renderer fingerprinting
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

// Precise device model mapping
const getExactDeviceName = async () => {
  const ua = navigator.userAgent;
  let model = "";

  // 1. Try Chromium User-Agent Client Hints API (Zero permissions, highest precision on Android/PC)
  if (navigator.userAgentData?.getHighEntropyValues) {
    try {
      const hints = await navigator.userAgentData.getHighEntropyValues([
        "model",
        "platform",
        "platformVersion",
        "architecture",
      ]);
      if (hints.model && hints.model.trim() !== "") {
        model = hints.model; // e.g. "SM-S918B", "Pixel 8 Pro", "Redmi Note 12"
      }
    } catch {
      // fallback
    }
  }

  // 2. Android Device Model Parsing from User Agent
  if (!model && /Android/i.test(ua)) {
    const androidMatch = ua.match(/Android\s+([0-9\.]+);\s+([^;]+)\s+Build/i) || ua.match(/Android\s+([0-9\.]+);\s+([^;\)]+)/i);
    if (androidMatch && androidMatch[2]) {
      model = `${androidMatch[2].trim()} (Android ${androidMatch[1]})`;
    } else {
      model = "Android Device";
    }
  }

  // 3. Apple iPhone Model Resolution Matrix
  if (/iPhone/i.test(ua)) {
    const w = window.screen.width;
    const h = window.screen.height;
    const dpr = window.devicePixelRatio || 1;
    const minDim = Math.min(w, h);
    const maxDim = Math.max(w, h);

    if (minDim === 430 && maxDim === 932 && dpr === 3) model = "Apple iPhone 15 Pro Max / 15 Plus / 14 Pro Max";
    else if (minDim === 393 && maxDim === 852 && dpr === 3) model = "Apple iPhone 15 / 15 Pro / 14 Pro";
    else if (minDim === 390 && maxDim === 844 && dpr === 3) model = "Apple iPhone 14 / 13 / 13 Pro / 12 / 12 Pro";
    else if (minDim === 428 && maxDim === 926 && dpr === 3) model = "Apple iPhone 14 Plus / 13 Pro Max / 12 Pro Max";
    else if (minDim === 375 && maxDim === 812 && dpr === 3) model = "Apple iPhone 13 mini / 12 mini / 11 Pro / XS / X";
    else if (minDim === 414 && maxDim === 896 && dpr === 2) model = "Apple iPhone 11 / XR";
    else if (minDim === 414 && maxDim === 896 && dpr === 3) model = "Apple iPhone 11 Pro Max / XS Max";
    else if (minDim === 375 && maxDim === 667 && dpr === 2) model = "Apple iPhone SE (2nd/3rd Gen) / 8 / 7";
    else model = `Apple iPhone (${minDim}x${maxDim} @${dpr}x)`;
  } else if (/iPad/i.test(ua)) {
    model = "Apple iPad Tablet";
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    model = "Apple Mac (MacBook / iMac / Mac Mini)";
  } else if (/Windows NT 10.0/i.test(ua)) {
    model = "Windows 11 / Windows 10 Computer";
  } else if (/Windows/i.test(ua)) {
    model = "Windows PC";
  } else if (/Linux/i.test(ua)) {
    model = "Linux Computer";
  }

  if (!model) {
    model = "Unknown Device";
  }

  // OS Detection
  let os = "Unknown OS";
  if (/Android/i.test(ua)) os = "Android";
  else if (/iPhone/i.test(ua)) os = "iOS (iPhone)";
  else if (/iPad/i.test(ua)) os = "iPadOS";
  else if (/Macintosh/i.test(ua)) os = "macOS";
  else if (/Windows/i.test(ua)) os = "Windows";
  else if (/Linux/i.test(ua)) os = "Linux";

  // Browser Detection
  let browser = "Unknown Browser";
  if (/Edg/i.test(ua)) browser = "Microsoft Edge";
  else if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) browser = "Google Chrome";
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = "Apple Safari";
  else if (/Firefox/i.test(ua)) browser = "Mozilla Firefox";
  else if (/Opera|OPR/i.test(ua)) browser = "Opera";

  const gpu = getGPUInfo();
  const cpuCores = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} Cores` : "N/A";
  const ram = navigator.deviceMemory ? `${navigator.deviceMemory} GB+ RAM` : "N/A";
  const touchPoints = navigator.maxTouchPoints || 0;
  const inputType = touchPoints > 0 ? `Touchscreen (${touchPoints} points)` : "Mouse & Keyboard";

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
    deviceName: model,
    os,
    browser,
    gpu,
    cpuCores,
    ram,
    inputType,
    batteryInfo,
    screen: `${window.screen?.width || window.innerWidth}x${window.screen?.height || window.innerHeight} (DPR: ${window.devicePixelRatio || 1}, ${window.screen?.colorDepth || 24}-bit)`,
    language: navigator.language || "Unknown",
    timeZone: Intl?.DateTimeFormat?.()?.resolvedOptions?.()?.timeZone || "Unknown",
    userAgent: ua,
  };
};

// Silent multi-tier IP & Network ISP resolution
const fetchSilentGeoLocation = async () => {
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
  } catch {}

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
  } catch {}

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
    const [device, geo] = await Promise.all([
      getExactDeviceName(),
      fetchSilentGeoLocation(),
    ]);

    const mapUrl = geo.lat && geo.lon ? `https://www.google.com/maps?q=${geo.lat},${geo.lon}` : "N/A";

    const subject = isLockout
      ? `🚨 VAULT LOCKOUT: ${device.deviceName} (4 Failed Attempts)`
      : `⚠️ Unauthorized PIN "${enteredPin}" on ${device.deviceName}`;

    const payload = {
      _subject: subject,
      "🚨 Security Event": isLockout ? "SYSTEM LOCKOUT (4 Failed Attempts)" : "Incorrect PIN Entry",
      "📱 Exact Device Name": device.deviceName,
      "🔢 Attempted PIN": enteredPin,
      "⚠️ Attempt Status": `${attemptCount} of 4 attempts`,
      "🕒 Exact Timestamp": new Date().toLocaleString(),
      
      // Hardware Specs
      "💻 OS & Browser": `${device.os} • ${device.browser}`,
      "🎮 GPU / Graphics Card": device.gpu,
      "⚡ CPU & RAM": `${device.cpuCores} | ${device.ram}`,
      "🖥️ Screen & Input": `${device.screen} | ${device.inputType}`,
      "🔋 Battery Status": device.batteryInfo,

      // Location & Network
      "📍 Location": `${geo.city}, ${geo.region}, ${geo.country} (Postal: ${geo.postal})`,
      "🏢 ISP / Network Provider": geo.isp,
      "🌐 IP Address": geo.ip,
      "🗺️ Network Map": mapUrl,
      "🌐 Timezone": device.timeZone,
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
