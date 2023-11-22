import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

interface Props<T> {
    label: string,
    options: T[],
    default_value: T[],
    option_render_func?: (val: T) => string,
    onValueChanged?: (items: T[]) => void,
}

export default function ComboBox<T>(props: Props<T>) {
  return (
    <Autocomplete
      fullWidth
      multiple
      disablePortal
      id="combo-box-demo"
      options={props.options}
      value={props.default_value}
      getOptionLabel={props.option_render_func}
      onChange={(e, v) => props.onValueChanged?.(v)}
      sx={{ m: 1, minWidth: 120, maxWidth: 450 }}
      renderInput={(params) => <TextField {...params} label={props.label} InputLabelProps={{ shrink: true }} />}
    />
  );
}