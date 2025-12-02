import { Request, Response, NextFunction } from "express";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    // Timestamp
    const now = new Date();
    const timestamp = now.toISOString().replace("T", " ").split(".")[0];

    // ANSI Colors
    const reset = "\x1b[0m";
    const bright = "\x1b[1m";
    const dim = "\x1b[2m";
    
    const cyan = "\x1b[36m";
    const blue = "\x1b[34m";
    const green = "\x1b[32m";
    const yellow = "\x1b[33m";
    const red = "\x1b[31m";
    const magenta = "\x1b[35m";
    const gray = "\x1b[90m";

    // Method colors
    const methodColors: { [key: string]: string } = {
      GET: cyan,
      POST: green,
      PUT: yellow,
      DELETE: red,
      PATCH: magenta,
      OPTIONS: gray,
      HEAD: gray,
    };

    const methodColor = methodColors[req.method] || blue;

    // Status color and icon
    let statusColor = green;
    let statusIcon = "✓";
    
    if (res.statusCode >= 200 && res.statusCode < 300) {
      statusColor = green;
      statusIcon = "✓";
    } else if (res.statusCode >= 300 && res.statusCode < 400) {
      statusColor = cyan;
      statusIcon = "↻";
    } else if (res.statusCode >= 400 && res.statusCode < 500) {
      statusColor = yellow;
      statusIcon = "⚠";
    } else if (res.statusCode >= 500) {
      statusColor = red;
      statusIcon = "✖";
    }

    // Duration color based on response time
    let durationColor = green;
    if (duration > 1000) durationColor = red;
    else if (duration > 500) durationColor = yellow;
    else if (duration > 200) durationColor = cyan;

    // Format duration
    const formattedDuration = duration > 1000 
      ? `${(duration / 1000).toFixed(2)}s` 
      : `${duration}ms`;

    // IP Address (sanitized)
    const ip = (req.ip || req.socket.remoteAddress || "-").replace("::ffff:", "");

    // User agent (shortened)
    const userAgent = req.get("user-agent") || "-";
    const browser = userAgent.includes("Chrome") ? "Chrome" 
                  : userAgent.includes("Firefox") ? "Firefox"
                  : userAgent.includes("Safari") ? "Safari"
                  : userAgent.includes("Postman") ? "Postman"
                  : "Other";

    // Build log line
    console.log(
      `${gray}┌─${reset} ` +
      `${dim}[${timestamp}]${reset} ` +
      `${gray}${ip.padEnd(15)}${reset} ` +
      `${dim}${browser.padEnd(8)}${reset}\n` +
      `${gray}├─${reset} ` +
      `${bright}${methodColor}${req.method.padEnd(7)}${reset}` +
      `${blue}${req.originalUrl}${reset}\n` +
      `${gray}└─${reset} ` +
      `${statusColor}${statusIcon} ${res.statusCode}${reset} ` +
      `${gray}•${reset} ` +
      `${durationColor}${formattedDuration.padStart(8)}${reset} ` +
      `${gray}•${reset} ` +
      `${dim}${getStatusText(res.statusCode)}${reset}`
    );
  });

  next();
};

// Helper function to get status text
function getStatusText(statusCode: number): string {
  const statusTexts: { [key: number]: string } = {
    200: "OK",
    201: "Created",
    204: "No Content",
    301: "Moved Permanently",
    302: "Found",
    304: "Not Modified",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    422: "Unprocessable Entity",
    429: "Too Many Requests",
    500: "Internal Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable",
  };

  return statusTexts[statusCode] || "Unknown";
}