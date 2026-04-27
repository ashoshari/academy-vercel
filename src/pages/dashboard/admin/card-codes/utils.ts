import { UAParser } from "ua-parser-js";

export const cleanObject = (obj: any) => {
  return Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(obj).filter(([_, v]) => {
      if (Array.isArray(v)) return v.length > 0;
      return v !== null && v !== undefined && v !== "";
    }),
  );
};

export function offerLinesFromGeneratedCode(code: any) {
  const raw = code?.offer_lines ?? code?.code?.offer_lines;
  if (!Array.isArray(raw) || raw.length === 0) return [];
  return [...raw].sort(
    (a, b) => (Number(a.order) || 0) - (Number(b.order) || 0),
  );
}

export const getClientInfo = () => {
  const parser = new UAParser();
  const result = parser.getResult();
  return {
    // 🧠 عام
    ua: result.ua, // user-agent string

    // 💻 الجهاز
    device: {
      model: result.device.model || "unknown",
      type: result.device.type || "desktop",
      vendor: result.device.vendor || "unknown",
    },

    // 💽 نظام التشغيل
    os: {
      name: result.os.name || "unknown",
      version: result.os.version || "unknown",
    },

    // 🌐 المتصفح
    browser: {
      name: result.browser.name || "unknown",
      version: result.browser.version || "unknown",
      major: result.browser.major || "unknown",
    },

    // ⚙️ محرك التصفح (Rendering Engine)
    engine: {
      name: result.engine.name || "unknown",
      version: result.engine.version || "unknown",
    },

    // 🧱 منصة التشغيل (CPU architecture)
    cpu: {
      architecture: result.cpu.architecture || "unknown",
    },
  };
};
