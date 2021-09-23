import { getAllSignedIn } from './gsheetsApi'
import { GoogleSpreadsheet } from "google-spreadsheet"
import credentials from "../../assets/tokens/service_auth_token.json"
import spreadsheet from "../../assets/tokens/spreadsheet.json"



export class AsyncGSheetsAdapter {
    // Optional: your adapter can take arguments
    constructor(doc_id) {
        // const DOC_ID = '1Yvt_H-IMjBmQDAQPqMY9TJzSgFruGOBLCZbbppt72dk'
        this.doc = new GoogleSpreadsheet(doc_id);
        this.loaded = false

        this.loader = this.doc.useServiceAccountAuth(credentials).then(this.doc.loadInfo).then(() => { this.loaded = true })

        this.read = this.read.bind(this)
    }

    async read() {
        let currentlySignedIn = await getAllSignedIn()

        // currentlySignedIn = currentlySignedIn.map(v => {v._sheet.headerValues})

        console.log("thing", currentlySignedIn, Object.keys(currentlySignedIn[0]))
        return currentlySignedIn
    }

    async write(data) {
        // await api.write(data)
    }

    async getAllSignedIn() {
        const signedInSheet = await this.getSheet("Currently Signed In")
        return await signedInSheet.getRows()
    }

    async getSheet(sheetName) {
        if (this.loaded) {
            return this.doc.sheetsByTitle[sheetName]
        } else {
            await this.loader
            return this.getSheet(sheetName)
        }
    }
}


export default (new AsyncGSheetsAdapter(spreadsheet.ID))