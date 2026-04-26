const fs = require("fs"); const lines = fs.readFileSync("App.tsx", "utf-8").split("\n"); fs.writeFileSync("App.tsx", [...lines.slice(0, 3727), ...lines.slice(5424)].join("\n"));
