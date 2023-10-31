import parse from "csv-parse/lib/sync";
import NP_DB_MEMBERS from "../NP_DB/members.csv";

// インターフェイス
export interface Member {
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
    
    private _MBTIs: Set<string> = new Set<string>();
    private _Heights: Set<string> = new Set<string>();
    private _Years: Set<string> = new Set<string>();

    public allStars: string[] = [];
    public allMBTI: string[] = [];
    public allBirthPlace: string[] = [];
    public allHeights: string[] = [];
    public allYears: string[] = [];

    constructor() {
        this._members = this.fetchCSV(NP_DB_MEMBERS);
        for (let member of this._members) {
            this.allStars.push(member.name);
            this._MBTIs.add(member.mbti);
            this._Heights.add(member.height);
            this._Years.add(member.birth_date.split('/')[0]);
        }

        this.allBirthPlace = [
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

        this.allMBTI = Array.from( this._MBTIs );
        this.allMBTI.sort();

        this.allHeights = Array.from( this._Heights );
        this.allHeights.sort();

        this.allYears = Array.from( this._Years );
        this.allYears.sort();
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

    memberName2ID = (membername: string): number => {
        let result = 0;
        for (let i of this._members) {
            if (i.name === membername) {
                result = Number(i.member_id);
            }
        }
        return result.valueOf();
    }

    id2member = (id: number): Member => {
        return this._members[id - 1];
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
