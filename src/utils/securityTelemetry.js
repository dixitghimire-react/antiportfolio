/**
 * Security Telemetry & Digital Fingerprint Dispatcher
 * Silently captures location, device, and network telemetry on failed access attempts
 * and sends an alert report to the administrator's email.
 */

const TARGET_EMAIL = "dixitghi69@gmail.com";
let lastAlertTimestamp = 0;

const getDeviceDetails = () => {
  const ua = navigator.userAgent;
  let os = "Unknown OS";
  if (ua.indexOf("Win") !== -1) os = "Windows";
  else if (ua.indexOf("Mac") !== -1) os = "macOS";
  else if (ua.indexOf("iPhone") !== -1 || ua.indexOf("iPad") !== -1) os = "iOS (Apple)";
  else if (ua.indexOf("Android") !== -1) os = "Android";
  else if (ua.indexOf("Linux") !== -1) os = "Linux";

  let browser = "Unknown Browser";
  if (ua.indexOf("Chrome") !== -1 && ua.indexOf("Edg") === -1) browser = "Chrome";
  else if (ua.indexOf("Safari") !== -1 && ua.indexOf("Chrome") === -1) browser = "Safari";
  else if (ua.indexOf("Edg") !== -1) browser = "Edge";
  else if (ua.indexOf("Firefox") !== -1) browser = "Firefox";

  return {
    os,
    browser,
    platform: navigator.platform || "Unknown",
    screen: `${window.screen?.width || window.innerWidth}x${window.screen?.height || window.innerHeight}`,
    language: navigator.language || "Unknown",
    timeZone: Intl?.DateTimeFormat?.()?.resolvedOptions?.()?.timeZone || "Unknown",
    userAgent: ua,
  };
};

export const sendSecurityAlert = async ({ enteredPin, attemptCount, isLockout = false }) => {
  const now = Date.now();
  // Prevent duplicate spam within 4 seconds unless it's a critical lockout
  if (!isLockout && now - lastAlertTimestamp < 4000) {
    return;
  }
  lastAlertTimestamp = now;

  try {
    const device = getDeviceDetails();
    let geo = {
      ip: "Unknown",
      city: "Unknown",
      region: "Unknown",
      country: "Unknown",
      isp: "Unknown",
    };

    // Attempt to fetch IP and location details
    try {
      const response = await fetch("https://ipwho.is/", { signal: AbortSignal.timeout(3000) });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          geo = {
            ip: data.ip || "Unknown",
            city: data.city || "Unknown",
            region: data.region || "Unknown",
            country: data.country || "Unknown",
            isp: data.connection?.isp || data.connection?.org || "Unknown",
          };
        }
      }
    } catch {
      // If ipwho.is is blocked or fails, try fallback
      try {
        const fallbackRes = await fetch("https://api.country.is/", { signal: AbortSignal.timeout(2000) });
        if (fallbackRes.ok) {
          const fb = await fallbackRes.json();
          geo.ip = fb.ip || "Unknown";
          geo.country = fb.country || "Unknown";
        }
      } catch {
        // Fallback silently
      }
    }

    const subject = isLockout
      ? `🚨 VAULT LOCKOUT TRIGGERED: 4 Failed Attempts (${geo.city}, ${geo.country})`
      : `⚠️ Unauthorized Vault Attempt: PIN "${enteredPin}" (${geo.city}, ${geo.country})`;

    const payload = {
      _subject: subject,
      "Security Event": isLockout ? "SYSTEM LOCKOUT (4 Failed Attempts)" : "Incorrect PIN Entry",
      "Attempted PIN": enteredPin,
      "Failed Attempt #": `${attemptCount} of 4`,
      "Timestamp": new Date().toLocaleString(),
      "📍 Location": `${geo.city}, ${geo.region}, ${geo.country}`,
      "🌐 IP Address": geo.ip,
      "🏢 ISP / Carrier": geo.isp,
      "📱 Device / OS": `${device.os} (${device.browser})`,
      "🖥️ Screen Resolution": device.screen,
      "🌐 Language / Timezone": `${device.language} / ${device.timeZone}`,
      "User-Agent": device.userAgent,
      _captcha: "false",
      _template: "table",
    };

    // Send silently in the background
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
