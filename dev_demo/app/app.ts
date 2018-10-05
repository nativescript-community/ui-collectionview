import "./bundle-config";

import application = require("application");
// import profiling = require("profiling");


// profiling.enable('timeline');
// profiling.start();
application.start({ moduleName: "main-page" });