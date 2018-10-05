import "./bundle-config";

import application = require("application");
import profiling = require("profiling");


(global as any).gc();   // Trigger a JavaScript GC pass
java.lang.System.gc();  // Trigger a Java GC Pass

// profiling.enable('timeline');
// profiling.start();
application.start({ moduleName: "main-page" });