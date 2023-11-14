import parse from "csv-parse/lib/sync";

/**
 * CSVから非同期でメンバ情報を拾ってくる
 * @returns メンバ一覧
 */
export const fetchCSVAsync = async <T>(filename: string): Promise<T> => {
    const response = await fetch(filename);
    const text = await response.text();
    const parsedCSV: T = parse(text, { columns: true });
    return parsedCSV;
  }
  