import {getAppDataSource} from "./lib/typeorm";

(async () => {
    await getAppDataSource().initialize();
})