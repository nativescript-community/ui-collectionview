import "./bundle-config";

import application = require("application");
// import profiling = require("profiling");


// // profiling.enable('timeline');
// profiling.disable();
application.start({ moduleName: "movietest/page" });