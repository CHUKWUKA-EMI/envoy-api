/* eslint-disable prettier/prettier */
import { ConnectionOptions } from "typeorm";
import * as dotenv from "dotenv";
import { User } from "./src/entity/User";

dotenv.config();

const walletFolder = "./walletConnection/";

const CONN_STRING = `tcps://adb.me-dubai-1.oraclecloud.com:1522/g094790142f4d14_chukwukadb_high.adb.oraclecloud.com?wallet_location=${walletFolder}`;

const ORMConfig: ConnectionOptions = {
  type: "oracle",
  connectString: CONN_STRING,
  username: "Admin",
  password: process.env.DB_PASSWORD,
  synchronize: false,
  migrationsRun: false,
  entities: [User],
  logging: true,
  migrations: ["dist/src/migration/*.js"],
  cli: {
    migrationsDir: "src/migration",
  },
};

export = ORMConfig;
