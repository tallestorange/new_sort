import { MobileDateRangePicker as DRPicker, DateRange, DateRangeDelimiter } from "@material-ui/pickers";
import { LocalizationProvider } from "@material-ui/pickers/LocalizationProvider";
import AdapterDateFns from '@date-io/date-fns';
import TextField from "@material-ui/core/TextField";
import { useEffect, useState } from "react";
import ja from 'date-fns/locale/ja';
import FormControl from "@material-ui/core/FormControl";
import makeStyles from "@material-ui/core/styles/makeStyles";

interface Props {
  dateFrom: Date | null,
  dateTo: Date | null,
  onDateRangeChanged?: (dateRange: DateRange) => void,
  startText?: string,
  endText?: string
}

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 450,
  }
}));

const DateRangePicker = (props: Props) => {
  const classes = useStyles();
  const {dateFrom, dateTo} = props;
  const [selectedDate, handleDateChange] = useState<DateRange>([dateFrom, dateTo]);

  useEffect(() => {
    handleDateChange([dateFrom, dateTo]);
  }, [dateFrom, dateTo]);

  return (
    <FormControl fullWidth className={classes.formControl}>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={ja} >
        <DRPicker
          startText={props.startText}
          endText={props.endText}
          value={selectedDate}
          onChange={date => {
            handleDateChange(date);
            props.onDateRangeChanged?.(date);
          }}
          inputFormat='yyyy/MM/dd'
          mask='____/__/__'
          maxDate={new Date()}
          renderInput={(startProps, endProps) => {
            startProps.helperText = "";
            endProps.helperText = "";
            return (
            <>
              <TextField {...startProps} variant="standard" fullWidth />
              <DateRangeDelimiter> 〜 </DateRangeDelimiter>
              <TextField {...endProps} variant="standard" fullWidth />
            </>
            )}
          }
        />
      </LocalizationProvider>
    </FormControl>
  )
}

export default DateRangePicker;