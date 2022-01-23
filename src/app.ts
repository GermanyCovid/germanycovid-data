import dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import { CovidService } from "./service/covid.service";
import { LogService } from "./service/log.service";

if (!fs.existsSync(process.env.FILE_PATH)) fs.mkdirSync(process.env.FILE_PATH, { recursive: true });

Promise.all([
    CovidService.fetchCoronaZahlenApi("germany"),
    CovidService.fetchCoronaZahlenApi("vaccinations"),
    CovidService.fetchCoronaZahlenApi("vaccinations/history/7"),
    CovidService.fetchIntensivRegisterApi()
]).catch((reason) => {
    LogService.logError(reason);
});

setInterval(() => {
    Promise.all([
        CovidService.fetchCoronaZahlenApi("germany"),
        CovidService.fetchCoronaZahlenApi("vaccinations"),
        CovidService.fetchCoronaZahlenApi("vaccinations/history/7"),
        CovidService.fetchIntensivRegisterApi()
    ]).catch((reason) => {
        LogService.logError(reason);
    });
}, 3600000);