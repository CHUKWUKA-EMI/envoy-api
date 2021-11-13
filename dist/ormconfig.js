"use strict";
var dotenv = require("dotenv");
var User_1 = require("./src/entity/User");
dotenv.config();
var walletFolder = "./walletConnection/";
var CONN_STRING = "tcps://adb.me-dubai-1.oraclecloud.com:1522/g094790142f4d14_chukwukadb_high.adb.oraclecloud.com?wallet_location=" + walletFolder;
var ORMConfig = {
    type: "oracle",
    connectString: CONN_STRING,
    username: "Admin",
    password: process.env.DB_PASSWORD,
    synchronize: false,
    migrationsRun: false,
    entities: [User_1.User],
    logging: true,
    migrations: ["dist/src/migration/*.js"],
    cli: {
        migrationsDir: "src/migration",
    },
};
module.exports = ORMConfig;
//# sourceMappingURL=ormconfig.js.map