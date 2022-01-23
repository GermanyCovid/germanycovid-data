import axios from "axios";
import fs from "fs";
import jsonDiff from "json-diff";
import { LogService } from "./log.service";

export namespace CovidService {

    export function fetchCoronaZahlenApi(router: "germany" | "vaccinations" | "vaccinations/history/7"): Promise<any> {
        return new Promise((resolve, reject) => {
            axios.get("https://api.corona-zahlen.org/" + router).then((response) => {
                const data = JSON.stringify(response.data);
                if(fs.existsSync(process.env.FILE_PATH + "/" + router.replace(RegExp("/", "g"), "-") + ".json")) {
                    return fs.readFile(process.env.FILE_PATH + "/" + router.replace(RegExp("/", "g"), "-") + ".json", (err, file) => {
                        if(err) return reject("File was not found.");
                        if(!jsonDiff.diff(JSON.parse(file.toString("utf8")), response.data)) {
                            LogService.logInfo("No change found");
                            return resolve(JSON.parse(file.toString("utf8")));
                        }
                        fs.writeFileSync(process.env.FILE_PATH + "/" + router.replace(RegExp("/", "g"), "-") + ".json", data);
                        LogService.logInfo("Change found overwrite the local file.");
                    });
                }
                fs.writeFileSync(process.env.FILE_PATH + "/" + router.replace(RegExp("/", "g"), "-") + ".json", data);
                LogService.logInfo("Change found overwrite the local file.");
                resolve(response.data);
            }).catch(() => reject("Axios request failed."));
        });
    }

    export function fetchIntensivRegisterApi(): Promise<any> {
        return new Promise((resolve, reject) => {
            axios.get("https://www.intensivregister.de/api/public/reporting/laendertabelle").then((response) => {
                const data = JSON.stringify(response.data);
                if(fs.existsSync(process.env.FILE_PATH + "/intesivregister.json")) {
                    return fs.readFile(process.env.FILE_PATH + "/intesivregister.json", (err, file) => {
                        if(err) return reject("File was not found.");
                        if(!jsonDiff.diff(JSON.parse(file.toString("utf8")), response.data)) {
                            LogService.logInfo("No change found");
                            return resolve(JSON.parse(file.toString("utf8")));
                        }
                        fs.writeFileSync(process.env.FILE_PATH + "/intesivregister.json", data);
                        LogService.logInfo("Change found overwrite the local file.");
                    });
                }
                fs.writeFileSync(process.env.FILE_PATH + "/intesivregister.json", data);
                LogService.logInfo("Change found overwrite the local file.");
                resolve(response.data);
            }).catch(() => reject("Axios request failed."));
        });
    }

}