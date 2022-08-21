import axios from "axios";
import fs from "fs";
import jsonDiff from "json-diff";
import { LogService } from "./log.service";

export namespace CovidService {

    export function fetchCoronaZahlenApi(router: "germany" | "vaccinations" | "vaccinations/history/7"): Promise<any> {
        return new Promise((resolve, reject) => {
            const filePath = process.env.FILE_PATH + "/" + router.replace(new RegExp("/", "g"), "-") + "_" + new Date().toLocaleDateString("de-DE").replace(/\./g, "-") + ".json";
            axios.get("https://api.corona-zahlen.org/" + router).then((response) => {
                const data = JSON.stringify(response.data);
                if(fs.existsSync(filePath)) {
                    return fs.readFile(filePath, (err, file) => {
                        if(err) return reject("File was not found.");
                        if(!jsonDiff.diff(JSON.parse(file.toString("utf8")), response.data)) {
                            LogService.logInfo("No change found");
                            return resolve(JSON.parse(file.toString("utf8")));
                        }
                        fs.writeFileSync(filePath, data);
                        LogService.logInfo("Change found overwrite the local file.");
                    });
                }
                fs.writeFileSync(filePath, data);
                LogService.logInfo("Change found overwrite the local file.");
                resolve(response.data);
            }).catch(() => reject("Axios request failed."));
        });
    }

    export function fetchIntensivRegisterApi(): Promise<any> {
        return new Promise((resolve, reject) => {
            const filePath = process.env.FILE_PATH + "/intensivregister_" + new Date().toLocaleDateString("de-DE").replace(/\./g, "-") + ".json";
            axios.get("https://www.intensivregister.de/api/public/reporting/laendertabelle").then((response) => {
                const data = JSON.stringify(response.data);
                if(fs.existsSync(filePath)) {
                    return fs.readFile(filePath, (err, file) => {
                        if(err) return reject("File was not found.");
                        if(!jsonDiff.diff(JSON.parse(file.toString("utf8")), response.data)) {
                            LogService.logInfo("No change found");
                            return resolve(JSON.parse(file.toString("utf8")));
                        }
                        fs.writeFileSync(filePath, data);
                        LogService.logInfo("Change found overwrite the local file.");
                    });
                }
                fs.writeFileSync(filePath, data);
                LogService.logInfo("Change found overwrite the local file.");
                resolve(response.data);
            }).catch(() => reject("Axios request failed."));
        });
    }

}
