import { useState, useEffect, memo, useCallback, useMemo } from "react";
import Select from '@material-ui/core/Select';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import { CustomCheckbox, CustomListItemText } from "./SearchConfig";

interface Props {
  title: string;
  id: string;
  items: string[];
  default_selected: string[];
  sort: boolean;
  sortFunction?: (left: string, right: string) => number;
  enabled: boolean;
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

const SearchSelect = memo((props: Props) => {
  const { default_selected, onValueChanged, items, title, id, sort, enabled, sortFunction } = props;
  const [currentItems, setCurrentItems] = useState<string[]>(default_selected);
  const isAllSelected = useMemo(() => { return currentItems.length === items.length }, [currentItems, items] );
  const classes = useStyles();

  useEffect(() => {
    setCurrentItems(default_selected);
  }, [default_selected]);

  const handleChange = useCallback((event: any) => {
    const value = event.target.value;
    let items_after: string[] = [];
    if (value[value.length - 1] === 'all') {
      items_after = isAllSelected ? [] : items;
    }
    else {
      items_after = value;
    }
    setCurrentItems(items_after);
    onValueChanged(items_after);
  }, [onValueChanged, isAllSelected, items]);

  const renderValue = useCallback((selected: any) => {
    let result: string[] = selected;
    if (sort) {
      result.sort(sortFunction);
    }
    return result.join(', ');
  }, [sortFunction, sort]);

  return (
    <FormControl disabled={!enabled} className={classes.formControl} fullWidth>
      <InputLabel id={id + "-select-label"}>{title}</InputLabel>
      <Select
        label={title}
        labelId={id + "-select-label"}
        id={id + "-select"}
        value={currentItems}
        multiple
        renderValue={renderValue}
        onChange={handleChange}
        inputProps={{id: id + "-select-input"}}
        MenuProps={{variant: "menu"}}
      >
        <MenuItem
          value="all"
          classes={{
            root: isAllSelected ? classes.selectedAll : ""
          }}
          id={id + "-item-selectall"}
        >
          <Checkbox checked={isAllSelected} id={id + "-checkbox-selectall"}/>
          <ListItemText
            classes={{ primary: classes.selectAllText }}
            primary="すべて選択する"
            id={id + "-text-selectall"}
          />
        </MenuItem>
        {items.map((val, index) => {
          return (
            <MenuItem key={index} value={val} id={id + "-item-" + index}>
              <CustomCheckbox id={id} index={index} checked={currentItems.indexOf(val) > -1} />
              <CustomListItemText title={val} id={id} index={index} />
            </MenuItem>)
        })}
      </Select>
    </FormControl>
  );
},
(before, after) => {
  return before.default_selected === after.default_selected && before.items === after.items;
});

export default SearchSelect;