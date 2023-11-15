import { DateRangePicker as DRPicker, DateRange, DateRangeDelimiter } from "@material-ui/pickers";
import { LocalizationProvider } from "@material-ui/pickers/LocalizationProvider";
import AdapterDateFns from '@date-io/date-fns';
import TextField from "@material-ui/core/TextField";
import { useState } from "react";
import ja from 'date-fns/locale/ja';
import FormControl from "@material-ui/core/FormControl";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 450,
  }
}));

const DateRangePicker = (props: {onDateRangeChanged?: (dateRange: DateRange) => void}) => {
  const [selectedDate, handleDateChange] = useState<DateRange>([null, new Date()]);
  const classes = useStyles();

  return (
    <FormControl fullWidth className={classes.formControl}>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={ja} >
        <DRPicker
          startText="生年月日(開始日)"
          endText="生年月日(終了日)"
          value={selectedDate}
          onChange={date => {
            handleDateChange(date);
            console.log(date[0], date[1])
            props.onDateRangeChanged?.(date);
          }}
          inputFormat="yyyy年MM月dd日"
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