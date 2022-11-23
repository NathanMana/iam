import {runDataSource} from "./lib/typeorm";

runDataSource()
    .then(() => {
        console.log("DONE")
    })
    .catch((err) => {
        console.log("Erreur : ", err)
    });