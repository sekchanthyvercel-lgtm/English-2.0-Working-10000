const fs = require("fs"); const cp = require("child_process"); console.log(cp.execSync("find / -name \"*App.tsx*\"").toString());
