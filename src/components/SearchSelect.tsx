import { useState } from "react";
import Select from '@material-ui/core/Select';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import React from "react";

interface Props {
  title: string;
  id: string;
  items: string[];
  default_selected: string[];
  sort: boolean;
  onValueChanged: (items: string[]) => void;
}

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 450,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
  selectAllText: {
    fontWeight: 700
  },
  selectedAll: {
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.08)"
    }
  }
}));

const CustomListItemText = React.memo((props: { title: string, id: string, index: number}) => {
  return (
    <ListItemText primary={props.title} id={props.id + "-text-" + props.index} />
  )
}, (before, after) => {
  return before.title === after.title;
})

const CustomCheckbox = React.memo((props: {id: string, index: number, checked: boolean}) => {
  return (
    <Checkbox checked={props.checked} id={props.id + "-checkbox-" + props.index} />
  )
}, (before, after) => {
  return before.checked === after.checked;
})

function SearchSelect(props: Props) {
  const [items, setItems] = useState<string[]>(props.default_selected);
  const targetLength = props.items.length;
  const targets = props.items;
  const isAllSelected = items.length === targetLength;
  const classes = useStyles();

  const handleChange = (event: any) => {
    const value = event.target.value;
    let items_after: string[] = [];
    if (value[value.length - 1] === 'all') {
      items_after = items.length === targetLength ? [] : targets;
    }
    else {
      items_after = value;
    }
    setItems(items_after);
    props.onValueChanged(items_after);
  };

  return (
    <FormControl className={classes.formControl} fullWidth>
      <InputLabel id={props.id + "-select-label"}>{props.title}</InputLabel>
      <Select
        label={props.title}
        labelId={props.id + "-select-label"}
        id={props.id + "-select"}
        value={items}
        multiple
        renderValue={(selected: any) => {
          let result = selected;
          if (props.sort) {
            result.sort();
          }
          return result.join(', ');
        }}
        onChange={handleChange}
        inputProps={{id: props.id + "-select"}}
      >
        <MenuItem
          value="all"
          classes={{
            root: isAllSelected ? classes.selectedAll : ""
          }}
          id={props.id + "-item-selectall"}
        >
          <Checkbox checked={isAllSelected} id={props.id + "-checkbox-selectall"}/>
          <ListItemText
            classes={{ primary: classes.selectAllText }}
            primary="すべて選択する"
            id={props.id + "-text-selectall"}
          />
        </MenuItem>
        {props.items.map((val, index) => {
          return (
            <MenuItem key={index} value={val} id={props.id + "-item-" + index}>
              <CustomCheckbox id={props.id} index={index} checked={items.indexOf(val) > -1} />
              <CustomListItemText title={val} id={props.id} index={index} />
            </MenuItem>)
        })}
      </Select>
    </FormControl>
  );
}

const CustomSelect = React.memo(
  SearchSelect,
  (before, after) => {
  if (before.title !== after.title) {
    return false;
  }
  if (before.id !== after.id) {
    return false;
  }
  if (before.onValueChanged !== after.onValueChanged) {
    return false;
  }
  if (before.items.length !== after.items.length) return false;
  for (let i = 0, n = before.items.length; i < n; ++i) {
    if (before.items[i] !== after.items[i]) return false;
  }
  if (before.items.length !== after.items.length) return false;
  for (let i = 0, n = before.items.length; i < n; ++i) {
    if (before.items[i] !== after.items[i]) return false;
  }
  if (before.default_selected.length !== after.default_selected.length) return false;
  for (let i = 0, n = before.default_selected.length; i < n; ++i) {
    if (before.default_selected[i] !== after.default_selected[i]) return false;
  }
  return true;
});

export default CustomSelect;