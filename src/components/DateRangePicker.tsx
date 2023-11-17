import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { ReactNode, memo, useCallback, useEffect, useRef, useState } from "react";
import ja from 'date-fns/locale/ja';
import FormControl from "@material-ui/core/FormControl";
import makeStyles from "@material-ui/core/styles/makeStyles";
import DateFnsUtils from '@date-io/date-fns';
import { DateRange } from "../hooks/useHPDatabase";
import Grid from "@material-ui/core/Grid";
import format from "date-fns/format";
import isEqual from "date-fns/isEqual";

interface Props {
  dateFrom: Date | null,
  dateTo: Date | null,
  dateInitFrom: Date | null,
  dateInitTo: Date | null,
  onDateRangeChanged?: (dateRange: DateRange) => void,
  onError?: (error: boolean) => void,
  startText: string,
  endText: string,
  disabled?: boolean;
}

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 450,
  }
}));

class ExtendedUtils extends DateFnsUtils {
  getCalendarHeaderText(date: any) {
    return format(date, "yyyy/M", { locale: this.locale });
  }
  getDatePickerHeaderText(date: any) {
    return format(date, "yyyy年M月d日", { locale: this.locale });
  }
}

const DateRangePicker = memo((props: Props) => {
  const classes = useStyles();
  const {dateFrom, dateTo, dateInitFrom, dateInitTo, onDateRangeChanged, disabled, startText, endText, onError} = props;
  const [selectedDateFrom, setSelectedDateFrom] = useState<Date | null>(null);
  const [selectedDateTo, setSelectedDateTo] = useState<Date | null>(null);

  const selectedDateFromRef = useRef<Date | null>(null);
  const selectedDateToRef = useRef<Date | null>(null);

  const stateA = useRef<boolean>(false);
  const stateB = useRef<boolean>(false);

  useEffect(() => {
    selectedDateFromRef.current = dateFrom;
    setSelectedDateFrom(dateFrom);
  }, [dateFrom]);

  useEffect(() => {
    selectedDateToRef.current = dateTo;
    setSelectedDateTo(dateTo);
  }, [dateTo]);

  const onChangedFrom = useCallback((date: Date | null) => {
    if (date !== null && Number.isNaN(date.getTime())) {
      return;
    }
    selectedDateFromRef.current = date;
    setSelectedDateFrom(date);
    onDateRangeChanged?.({from: selectedDateFromRef.current, to: selectedDateToRef.current});
  },[onDateRangeChanged]);

  const onChangedTo = useCallback((date: Date | null) => {
    if (date !== null && Number.isNaN(date.getTime())) {
      return;
    }
    selectedDateToRef.current = date;
    setSelectedDateTo(date);
    onDateRangeChanged?.({from: selectedDateFromRef.current, to: selectedDateToRef.current});
  },[onDateRangeChanged]);

  const onErrorFrom = useCallback((a: ReactNode, b: any) => {
    stateA.current = a !== ""
    onError?.(stateA.current || stateB.current)
  }, [onError]);

  const onErrorTo = useCallback((a: ReactNode, b: any) => {
    stateB.current = a !== ""
    onError?.(stateA.current || stateB.current)
  }, [onError]);

  return (
    <FormControl fullWidth className={classes.formControl}>
      <Grid container item xs={12} justifyContent="center" spacing={0}>
        <MuiPickersUtilsProvider utils={ExtendedUtils} locale={ja}>
          <Grid container item sm={12} md={6} justifyContent="center" spacing={0}>
            <KeyboardDatePicker
              margin="normal"
              fullWidth
              id="date-picker-dialog-from"
              label={disabled ? startText + "(読み込み中...)" : startText}
              format="yyyy/MM/dd"
              mask="____/__/__"
              value={selectedDateFrom}
              minDate={dateInitFrom}
              maxDate={selectedDateTo}
              disabled={disabled}
              onChange={onChangedFrom}
              onError={onErrorFrom}
              cancelLabel="キャンセル"
              okLabel="選択"
              animateYearScrolling={false}
              KeyboardButtonProps={{
                'aria-label': 'change start date',
              }}
            />
          </Grid>
          <Grid container item sm={12} md={6} justifyContent="center" spacing={0}>
            <KeyboardDatePicker
              margin="normal"
              fullWidth
              id="date-picker-dialog-to"
              label={disabled ? endText + "(読み込み中...)" : endText}
              format="yyyy/MM/dd"
              value={selectedDateTo}
              minDate={selectedDateFrom}
              maxDate={dateInitTo}
              disabled={disabled}
              onChange={onChangedTo}
              onError={onErrorTo}
              cancelLabel="キャンセル"
              okLabel="選択"
              animateYearScrolling={false}
              KeyboardButtonProps={{
                'aria-label': 'change finish date',
              }}
            />
          </Grid>
        </MuiPickersUtilsProvider>
      </Grid>
    </FormControl>
  )
},
(a, b) => {
  if (a.dateFrom === null || b.dateFrom === null || a.dateTo === null || b.dateTo === null) {
    return false;
  }
  else {
    return isEqual(a.dateFrom!, b.dateFrom!) && isEqual(a.dateTo!, b.dateTo!);
  }
});

export default DateRangePicker;