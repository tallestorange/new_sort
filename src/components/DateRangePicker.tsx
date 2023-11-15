import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { memo, useEffect, useRef, useState } from "react";
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
  const {dateFrom, dateTo, dateInitFrom, dateInitTo, onDateRangeChanged, disabled, startText, endText} = props;
  const [selectedDateFrom, setSelectedDateFrom] = useState<Date | null>(null);
  const [selectedDateTo, setSelectedDateTo] = useState<Date | null>(null);
  const selectedDateFromRef = useRef<Date | null>(null);
  const selectedDateToRef = useRef<Date | null>(null);

  const stateA = useRef<boolean>(false);
  const stateB = useRef<boolean>(false);

  useEffect(() => {
    setSelectedDateFrom(dateFrom);
  }, [dateFrom]);

  useEffect(() => {
    setSelectedDateTo(dateTo);
  }, [dateTo]);

  useEffect(() => {
    if (selectedDateFrom === null || selectedDateTo === null) {
      return;
    }
    if (isEqual(selectedDateFrom!, selectedDateFromRef.current!) && isEqual(selectedDateTo!, selectedDateToRef.current!)) {
      return;
    }
    selectedDateFromRef.current = selectedDateFrom;
    selectedDateToRef.current = selectedDateTo;
    onDateRangeChanged?.({from: selectedDateFrom, to: selectedDateTo});
  }, [selectedDateFrom, selectedDateTo, onDateRangeChanged]);

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
              onChange={setSelectedDateFrom}
              onError={(a,_) => {
                stateA.current = a !== ""
                props.onError?.(stateA.current || stateB.current)
              }}
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
              onChange={setSelectedDateTo}
              onError={(a,_) => {
                stateB.current = a !== ""
                props.onError?.(stateA.current || stateB.current)
              }}
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