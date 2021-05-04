import {GoogleSpreadsheet} from "google-spreadsheet"
import credentials from "../assets/tokens/service_auth_token.json"

const DOC_ID = '1Yvt_H-IMjBmQDAQPqMY9TJzSgFruGOBLCZbbppt72dk'
const doc = new GoogleSpreadsheet(DOC_ID);

var loaded = false

const loader = (async () => {
    await doc.useServiceAccountAuth(credentials)
    await doc.loadInfo()
})().then(() => loaded = true)

export async function getSheet(sheetName) {
    if (loaded) {
        return doc.sheetsByTitle[sheetName]
    } else {
        await loader
        return getSheet(sheetName)
    }
}

export async function getAllMembers() {
    const membersSheet = await getSheet("Members")
    return await membersSheet.getRows()
    
}

export async function getAllClockedIn() {
    const clockedInSheet = await getSheet("Currently Clocked In")
    return await clockedInSheet.getRows()
}

export async function checkIfIdIsRegistered(id) {
    const rows = await getAllMembers()

    for (const row of rows) {
        if (row["ID"] === id) {
            return true
        }
    }

    return false
}

export async function getName(id) {
    const rows = await getAllMembers()

    for (const row of rows) {
        if (row["ID"] === id) {
            return row["Name"]
        }
    }
    return null
}

export async function setName(name, id) {
    const rows = await getAllMembers()

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
        await membersSheet.addRow({Name: name, ID: id, "Date Added": getDateTime()[0]})
        return true
    }
    return false
}

export async function isClockedIn(id) {
    const clockedIn = await getAllClockedIn()

    for (let row of clockedIn) {
        if (row["ID"] === id) {
            return true
        }
    }

    return false
}

export async function clockIn(id) {
    const isRegistered = await checkIfIdIsRegistered(id)

    if (isRegistered) {
        if (await isClockedIn(id)) {
            return true
        } else {
            const clockedInSheet = doc.sheetsByTitle["Currently Clocked In"]
            const [date, time] = getDateTime()
            await clockedInSheet.addRow({Date: date, Time: time, Name: await getName(id), ID: id})
            return true
        }
    } else {
        return false
    }
}

export async function clockOut(id, outTime) {
    outTime = outTime ? outTime : getDateTime()[1]

    let clockedIn = await getAllClockedIn()

    for (let clockedInRow of clockedIn) {
        if (clockedInRow.ID === id) {
            let hoursSheet = await getSheet("Hours")
            await hoursSheet.addRow({Date: clockedInRow.Date, Name: await getName(id), ID: id, "Time In": clockedInRow.Time, "Time Out": outTime})
            await clockedInRow.delete()
            return true
        }
    }
    return false
}


function getDateTime() {
    const datetime = new Date()

    return [datetime.toLocaleDateString(), `${datetime.getHours()}:${datetime.getMinutes()}`]
}