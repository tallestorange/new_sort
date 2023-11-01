import { useState, useMemo } from "react";
import Select from '@material-ui/core/Select';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';

interface Props {
  title: string;
  items: string[];
  default_selected: string[];
  sort: boolean;
  onSubmit: (items: string[]) => void;
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

export default function SearchSelect(props: Props) {
  const [items, setItems] = useState<string[]>(props.default_selected);
  const targetLength = props.items.length;
  const targets = props.items;
  const isAllSelected = useMemo(() => items.length === targetLength, [items, targetLength])

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
    props.onSubmit(items_after);
  };

  return (
    <FormControl className={classes.formControl} fullWidth>
      <InputLabel id="mutiple-select-label">{props.title}</InputLabel>
      <Select
        id="select"
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
      >
        <MenuItem
          value="all"
          classes={{
            root: isAllSelected ? classes.selectedAll : ""
          }}
        >
          <Checkbox checked={isAllSelected} />
          <ListItemText
            classes={{ primary: classes.selectAllText }}
            primary="すべて選択する"
          />
        </MenuItem>
        {props.items.map((val) => {
          return (
            <MenuItem key={val} value={val}>
              <Checkbox checked={items.indexOf(val) > -1} />
              <ListItemText primary={val} />
            </MenuItem>)
        })}
      </Select>
    </FormControl>
  );
}