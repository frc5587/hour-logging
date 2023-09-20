import {GoogleSpreadsheet} from "google-spreadsheet"
import spreadsheet from "../assets/tokens/spreadsheet.json"
import {getToken, tokenIsExpired} from "./auth";

let doc;
var loaded = false

const loader = (async () => {
    let token = (await getToken()).access_token;
    doc = new GoogleSpreadsheet(spreadsheet.ID, {token: await token});
    await doc.loadInfo()
})().then(() => loaded = true)

export function formatRow(row) {
    let finalRow = {};
    if(row.hasOwnProperty("_worksheet")) {
        for(let i = 0; i < row["_worksheet"]["_headerValues"].length; i++) {
            let title = row["_worksheet"]["_headerValues"][i];
            finalRow[title] = row["_rawData"][i]
        }
    }
    else {
        finalRow = row;
    }
    return finalRow;
}

export async function checkIfLoggedInTooLong() {
    const rows = await getAllSignedIn()
    const peopleToSignOut = []
    
    for (let row of rows) {
        let rowFormatted = formatRow(row)
        if (new Date(rowFormatted["Date"]) < getTodaysDate()) {
            peopleToSignOut.push(rowFormatted["ID"])
        }
    }
    
    if (peopleToSignOut.length > 0) {
        await signOutMultiple(peopleToSignOut, peopleToSignOut.map(() => "18:00"))
    }

    console.log("Check logged in", getDateTime(), peopleToSignOut, rows)
}

export async function getSheet(sheetName) {
    if (loaded && !tokenIsExpired()) {
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
        let rowFormatted = formatRow(row)
        if (rowFormatted.ID === id) {
            return true
        }
    }

    return false
}

export async function getName(id) {
    const rows = await getAllMembers()

    for (const row of rows) {
        let rowFormatted = formatRow(row);
        if (rowFormatted["ID"] === id) {
            return rowFormatted["Name"]
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

/** 
 * uses tons of API calls, use signOutMultiple instead for signing out more than one person at a time
 */
export async function signOut(id, outTime) {
    outTime = outTime ? outTime : getDateTime()[1]

    let signedIn = await getAllSignedIn()

    for (let signedInRow of signedIn) {
        let signedInRowFormatted = formatRow(signedInRow);
        if (signedInRowFormatted.ID === id) {
            let hoursSheet = await getSheet("Hours")
            await hoursSheet.addRow({Date: signedInRowFormatted.Date, Name: await getName(id), ID: id, "Time In": signedInRowFormatted.Time, "Time Out": outTime})
            await signedInRow.delete()
            return true
        }
    }
    return false
}

export async function signOutMultiple(ids, outTimes) {
    if (outTimes === undefined) {
        outTimes = ids.map(() => getDateTime()[1])
    } else if (ids.length !== outTimes.length) {
        throw new Error("`OutTimes` needs to be the same length as `ids`")
    }
    let signedInSheet = await getSheet("Currently Signed In")
    let signedInUnformatted = await signedInSheet.getRows();
    let signedIn = []
    for (const row of signedInUnformatted) {
        let rowFormatted = formatRow(row);
        signedIn.push(rowFormatted);
    }

    let header = signedInUnformatted[0]._worksheet._headerValues
    let allIDs = signedIn.map(v => v.ID)
    let newSignedOuts = []
    
    let removes = []
    for (let [id, outTime] of allIDs.map((v, i) => [v, outTimes[i]])) {
        let idx = allIDs.indexOf(id) 
        if (idx !== -1) {
            let row = signedIn[idx]
            removes.push(idx)
            newSignedOuts.push({Date: row.Date, Name: await getName(id), ID: id, "Time In": row.Time, "Time Out": outTime})

        } else {
            console.log("Not signed in!", id)
        }
    }

    signedIn = signedIn.filter((v, i) => !removes.includes(i))

    await signedInSheet.clear()
    await signedInSheet.setHeaderRow(header)
    
    if (signedIn.length > 0) {
        await signedInSheet.addRows(signedIn)
    }

    let hoursSheet = await getSheet("Hours")
    await hoursSheet.addRows(newSignedOuts)

}

export function getDateTime() {
    const datetime = new Date()

    // Needs to pass in the locale, otherwise the format isn't consistent
    return [datetime.toLocaleDateString('en-US'), `${zeroPad(datetime.getHours())}:${zeroPad(datetime.getMinutes())}`]
}

function zeroPad(string) {
    return ("" + string).length === 1? "0" + string : string
}

export function getTodaysDate() {
    // Needs to pass in the locale, otherwise the format isn't consistent
    return new Date(new Date().toLocaleDateString('en-US'))
}
