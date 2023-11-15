import { DateRangePicker as DRPicker, DateRange, DateRangeDelimiter } from "@material-ui/pickers";
import { LocalizationProvider } from "@material-ui/pickers/LocalizationProvider";
import AdapterDateFns from '@date-io/date-fns';
import TextField from "@material-ui/core/TextField";
import { useState } from "react";

const DateRangePicker = (props: {}) => {
  const [selectedDate, handleDateChange] = useState<DateRange>([null, new Date()]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} >
      <DRPicker
        startText="生年月日(開始日)"
        endText="生年月日(終了日)"
        value={selectedDate}
        onChange={date => handleDateChange(date)}
        inputFormat="yyyy年MM月dd日"              
        renderInput={(startProps, endProps) => {
          console.log(startProps, endProps);
          startProps.helperText = "";
          endProps.helperText = "";
          return (
          <>
            <TextField {...startProps} variant="standard" />
            <DateRangeDelimiter> 〜 </DateRangeDelimiter>
            <TextField {...endProps} variant="standard" />
          </>
          )}
        }
      />
    </LocalizationProvider>
  )
}

export default DateRangePicker;