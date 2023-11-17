import { parse, format } from "date-fns";

export const parseDate = (dateString?: string | null, format: string = 'yyyy/MM/dd'): Date | undefined => {
  if (dateString === "" || dateString === undefined || dateString === null) {
    return undefined;
  }
  else {
    const res = parse(dateString, format, new Date())
    if (Number.isNaN(res.getTime())) {
      return undefined;
    }
    return res;
  }
}

export const formatDate = (date: Date, string_format: string = 'yyyy/MM/dd'): string => {
  return format(date, string_format);
}