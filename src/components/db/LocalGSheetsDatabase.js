import { LowSync } from 'lowdb'
// import {} from './gsheetsApi'
import GSheetsAdapter from './GSheetsAdapter'


export class Database {
    constructor(adapter) {
        this.adapter = adapter
        this.db = new LowSync(adapter)


        this.db.read()
    }


}
console.log("adfaf")

export default (new Database(new GSheetsAdapter()))