import { parse, format } from "date-fns";

export const parseDate = (dateString: string): Date | undefined => {
  if (dateString === "") {
    return undefined;
  }
  else {
    return parse(dateString, 'yyyy/MM/dd', new Date())
  }
}
  
export const formatDate = (date: Date): string => {
  return format(date, 'yyyy/MM/dd');
}