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
        for (let i of this._members) {
            members.push(i.name);
        }
        return members;
    }

    get allMBTI(): string[] {
        let mbti = new Set<string>();
        for (let i of this._members) {
            mbti.add(i.mbti);
        }
        let result = Array.from( mbti );
        result.sort();
        return result;
    }

    get allBirthPlace(): string[] {
        // let bp = new Set<string>();
        // for (let i of this._members) {
        //     bp.add(i.birth_place);
        // }
        // let result = Array.from( bp );
        let result: string[] = [
            '北海道',
            '岩手',
            '宮城',
            '福島',
            '栃木',
            '群馬',
            '埼玉',
            '千葉',
            '東京',
            '神奈川',
            '新潟',
            '石川',
            '長野',
            '愛知',
            '三重',
            '京都',
            '大阪',
            '兵庫',
            '奈良',
            '岡山',
            '広島',
            '徳島',
            '香川',
            '福岡',
            '熊本',
            '宮崎',
            'アメリカ',
            'インドネシア'
        ];
        return result;
    }

    get allHeights(): string[] {
        let data = new Set<string>();
        for (let i of this._members) {
            data.add(i.height);
        }
        let result = Array.from( data );
        result.sort();
        return result;
    }

    get allYears(): string[] {
        let data = new Set<string>();
        for (let i of this._members) {
            data.add(i.birth_date.split('/')[0]);
        }
        let result = Array.from( data );
        result.sort();
        return result;
    }

    search(mbti: string[], birthplaces: string[], heights: string[], years: string[]): string[] {
        let mbti_set = new Set(mbti);
        let birthplace_set = new Set(birthplaces);
        let heights_set = new Set(heights);
        let years_set = new Set(years);

        let result: string[] = [];
        for (let i of this._members) {
            if (mbti_set.has(i.mbti) && birthplace_set.has(i.birth_place) && heights_set.has(i.height) && years_set.has(i.birth_date.split('/')[0])) {
                result.push(i.name);
            }
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
