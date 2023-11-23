import { memo } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

interface Props<T> {
    label: string,
    id?: string,
    options: T[],
    default_value: T[],
    is_option_equal?: (option: T, value: T) => boolean;
    option_render_func?: (val: T) => string,
    option_disabled_func?: (option: T) => boolean;
    onValueChanged?: (items: T[]) => void,
}

const MultiSelectBox = memo(<T,>(props: Props<T>) => {
  return (
    <Autocomplete
      fullWidth
      multiple
      disablePortal
      id={props.id}
      options={props.options}
      value={props.default_value}
      getOptionLabel={props.option_render_func}
      getOptionDisabled={props.option_disabled_func}
      isOptionEqualToValue={props.is_option_equal}
      disableCloseOnSelect
      onChange={(e, v) => props.onValueChanged?.(v)}
      sx={{ m: 1, minWidth: 120, maxWidth: 450 }}
      renderInput={(params) => {
        return (
          <TextField {...params} label={props.label} InputLabelProps={{ shrink: true }} />
        )
      }}
    />
  );
},
(a, b) => {
  return a.default_value === b.default_value && a.options === b.options;
}
);

export default MultiSelectBox;