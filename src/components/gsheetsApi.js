import {GoogleSpreadsheet} from "google-spreadsheet"
import credentials from "../assets/tokens/hour-logging-819a5f2f0430.json"

const DOC_ID = '1Yvt_H-IMjBmQDAQPqMY9TJzSgFruGOBLCZbbppt72dk'
const doc = new GoogleSpreadsheet(DOC_ID);


(async () => {
    await doc.useServiceAccountAuth(credentials)
    await doc.loadInfo()
})()

export async function checkIfIdIsRegistered(id) {
    const membersSheet = doc.sheetsByTitle["Members"]
    const rows = await membersSheet.getRows()
    for (const row of rows) {
        if (row["ID"] === id) {
            return true
        }
    }

    return false
}

export async function getName(id) {
    const membersSheet = doc.sheetsByTitle["Members"]
    const rows = await membersSheet.getRows()

    for (const row of rows) {
        if (row["ID"] === id) {
            return row["Name"]
        }
    }
    return null
}

export async function setName(name, id) {
    const membersSheet = doc.sheetsByTitle["Members"]
    const rows = await membersSheet.getRows()

    for (let i = 0; i < rows.length; i++) {
        if (rows[i]["ID"] === id) {
            rows[i]["Name"] = name
            await rows[i].save()
            break
        }
    }
}


export async function registerMember(name, id) {
    const isRegistered = await checkIfIdIsRegistered(id)

    if (isRegistered) {
        const loggedName = await getName(id)

        if (loggedName !== name) {
            await setName(name, id)
            return true
        }
    } else {
        const membersSheet = doc.sheetsByTitle["Members"]
        await membersSheet.addRow({Name: name, ID: id, "Date Added": (new Date()).toLocaleDateString()})
        return true
    }
    return false
}