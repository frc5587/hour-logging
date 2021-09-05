import {GoogleSpreadsheet} from "google-spreadsheet"
import credentials from "../assets/tokens/service_auth_token.json"

const DOC_ID = '1Yvt_H-IMjBmQDAQPqMY9TJzSgFruGOBLCZbbppt72dk'
const doc = new GoogleSpreadsheet(DOC_ID);

var loaded = false

const loader = (async () => {
    await doc.useServiceAccountAuth(credentials)
    await doc.loadInfo()

    checkIfLoggedInTooLong()
    setInterval(checkIfLoggedInTooLong, 3600000) // repeats every hour
})().then(() => loaded = true)

export async function checkIfLoggedInTooLong() {
    const rows = await getAllSignedIn()
    const peopleToSignOut = []

    for (let row of rows) {
        if (new Date(row["Date"]) < getTodaysDate()) {
            peopleToSignOut.push(row["ID"])
        }
    }

    for (let id of peopleToSignOut) {
        await signOut(id, "18:00")  // signs people out at 6:00 pm
    }
}

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

export async function getAllSignedIn() {
    const signedInSheet = await getSheet("Currently Signed In")
    return await signedInSheet.getRows()
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
        const membersSheet = getSheet("Members")
        await membersSheet.addRow({Name: name, ID: id, "Date Added": getDateTime()[0]})
        return true
    }
    return false
}

export async function isSignedIn(id) {
    const signedIn = await getAllSignedIn()

    for (let row of signedIn) {
        if (row["ID"] === id) {
            return true
        }
    }

    return false
}

export async function signIn(id) {
    const isRegistered = await checkIfIdIsRegistered(id)

    if (isRegistered) {
        if (await isSignedIn(id)) {
            return true
        } else {
            const signedInSheet = doc.sheetsByTitle["Currently Signed In"]
            const [date, time] = getDateTime()
            await signedInSheet.addRow({Date: date, Time: time, Name: await getName(id), ID: id})
            return true
        }
    } else {
        return false
    }
}

export async function signOut(id, outTime) {
    outTime = outTime ? outTime : getDateTime()[1]

    let signedIn = await getAllSignedIn()

    for (let signedInRow of signedIn) {
        if (signedInRow.ID === id) {
            let hoursSheet = await getSheet("Hours")
            await hoursSheet.addRow({Date: signedInRow.Date, Name: await getName(id), ID: id, "Time In": signedInRow.Time, "Time Out": outTime})
            await signedInRow.delete()
            return true
        }
    }
    return false
}

function getDateTime() {
    const datetime = new Date()

    return [datetime.toLocaleDateString(), `${zeroPad(datetime.getHours())}:${zeroPad(datetime.getMinutes())}`]
}

function zeroPad(string) {
    return ("" + string).length === 1? "0" + string : string
}

function getTodaysDate() {
    return new Date(new Date().toLocaleDateString())
}
