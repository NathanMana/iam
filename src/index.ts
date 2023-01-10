import { getAppDataSource } from "./lib/typeorm";

async () => {
  try {
    await getAppDataSource().initialize();
  } catch (e) {
    console.error(e);
  }
};
