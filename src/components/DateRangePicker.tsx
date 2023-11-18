import { DatePicker, DateValidationError, LocalizationProvider } from '@mui/x-date-pickers';
import { ReactNode, memo, useCallback, useEffect, useRef, useState } from "react";
import ja from 'date-fns/locale/ja';
import FormControl from '@mui/material/FormControl';
import { DateRange } from "../hooks/useHPDatabase";
import Grid from '@mui/material/Grid';
import isEqual from "date-fns/isEqual";
import { NOW_LOADING } from "../modules/Constants";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

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

const DateRangePicker = memo((props: Props) => {
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
    selectedDateFromRef.current = date;
    setSelectedDateFrom(date);
    if (date !== null && Number.isNaN(date.getTime())) {
      return;
    }
    onDateRangeChanged?.({from: selectedDateFromRef.current, to: selectedDateToRef.current});
  },[onDateRangeChanged]);

  const onChangedTo = useCallback((date: Date | null) => {
    selectedDateToRef.current = date;
    setSelectedDateTo(date);
    if (date !== null && Number.isNaN(date.getTime())) {
      return;
    }
    onDateRangeChanged?.({from: selectedDateFromRef.current, to: selectedDateToRef.current});
  },[onDateRangeChanged]);

  const onErrorFrom = useCallback((a: DateValidationError, b: Date | null) => {
    stateA.current = a !== null;
    onError?.(stateA.current || stateB.current)
  }, [onError]);

  const onErrorTo = useCallback((a: DateValidationError, b: Date | null) => {
    stateB.current = a !== null;
    onError?.(stateA.current || stateB.current)
  }, [onError]);

  return (
    <FormControl fullWidth sx={{ m: 1, minWidth: 120, maxWidth: 450 }}>
      <Grid container item xs={12} justifyContent="center" spacing={3}>
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={ja}
          dateFormats={{ monthAndYear: "yyyy/M" }}
          localeText={{
            previousMonth: "前月を表示",
            nextMonth: "次月を表示",
            cancelButtonLabel: "キャンセル",
            okButtonLabel: "選択",
          }}
        >
          <Grid container item sm={12} md={6} justifyContent="center" spacing={0}>
            <DatePicker
              id="date-picker-dialog-from"
              label={disabled ? `${startText}(${NOW_LOADING})` : startText}
              format="yyyy/MM/dd"
              mask="____年__月__日"
              value={selectedDateFrom}
              minDate={dateInitFrom}
              maxDate={selectedDateTo}
              disabled={disabled}
              onChange={onChangedFrom}
              onError={onErrorFrom}
              allowKeyboardControl
              animateYearScrolling={false}
              KeyboardButtonProps={{
                'aria-label': 'change start date',
              }}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid container item sm={12} md={6} justifyContent="center" spacing={0}>
            <DatePicker
              id="date-picker-dialog-to"
              label={disabled ? `${endText}(${NOW_LOADING})` : endText}
              format="yyyy/MM/dd"
              mask="____年__月__日"
              value={selectedDateTo}
              minDate={selectedDateFrom}
              maxDate={dateInitTo}
              disabled={disabled}
              onChange={onChangedTo}
              onError={onErrorTo}
              allowKeyboardControl
              animateYearScrolling={false}
              KeyboardButtonProps={{
                'aria-label': 'change finish date',
              }}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
        </LocalizationProvider>
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