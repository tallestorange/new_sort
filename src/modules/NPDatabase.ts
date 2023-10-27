import parse from "csv-parse/lib/sync";
import NP_DB_MEMBERS from "../NP_DB/members.csv";

// インターフェイス
interface Member {
    member_id: string;
    name: string;
    birth_date: string;
    birth_place: string;
    mbti: string;
    height: string;
    hobby: string;
    special_skill: string;
}

class NPDatabase {
    private _members: Member[] = [];

    constructor() {
        this._members = this.fetchCSV(NP_DB_MEMBERS);
    }

    get allStars(): string[] {
        let members: string[] = [];
        let result: string[] = [];
        for (let i of this._members) {
            result.push(i.name);
        }
        return result;
    }

    memberName2ID = (membername: string): string => {
        let result = 0;
        for (let i of this._members) {
            if (i.name === membername) {
                result = Number(i.member_id);
            }
        }
        return result.toString();
    }

    // CSVを取得する
    private fetchCSV = (url: string): any[] => {
        const request = new XMLHttpRequest();
        request.open("GET", url, false);
        request.send(null);
        const csv = request.responseText;
        return parse(csv, { columns: true });
    }
}

const npDB = new NPDatabase();
export default npDB;
