import { useState, useEffect, memo, useCallback, useMemo, useRef } from "react";
import Select from '@material-ui/core/Select';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';

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

export const SearchSelect = memo((props: Props) => {
  const { default_selected, onValueChanged, items, title, id, sort, enabled, sortFunction } = props;
  const [currentItems, setCurrentItems] = useState<string[]>(default_selected);
  const isAllSelected = useMemo(() => { return currentItems.length === items.length }, [currentItems, items] );
  const allSelectedSet = useMemo(() => {
    const v = new Set<number>();
    for (let i = 0; i < items.length; i++) {
      v.add(i);
    }
    return v;
  }, [items]); 
  const classes = useStyles();

  const selectedSet = useRef<Set<number>>();
  if (!selectedSet.current) {
    selectedSet.current = new Set<number>();
  }

  useEffect(() => {
    selectedSet.current = new Set<number>();
    for (let selected_item of default_selected) {
      selectedSet.current.add(items.indexOf(selected_item));
    }
    setCurrentItems(default_selected)
  }, [default_selected, items]);

  const renderValue = useCallback((selected: any) => {
    let result: string[] = selected;
    if (sort) {
      result.sort(sortFunction);
    }
    return result.join(', ');
  }, [sortFunction, sort]);

  const handleChange = useCallback((index: number, selected: boolean) => {
    if (selected) {
      selectedSet.current!.add(index);
    }
    else {
      selectedSet.current!.delete(index);
    }
    const after = Array.from(selectedSet.current!).map((v) => { return items[v] });
    setCurrentItems(after)
    onValueChanged(after);
  }, [items, onValueChanged])

  const handleSelectAll = useCallback(() => {
    if (isAllSelected) {
      selectedSet.current!.clear();
      setCurrentItems([])
      onValueChanged([])
    }
    else {
      selectedSet.current = allSelectedSet;
      setCurrentItems(items)
      onValueChanged(items)
    }
  }, [items, onValueChanged, isAllSelected, allSelectedSet]);

  return (
    <FormControl disabled={!enabled} className={classes.formControl} fullWidth>
      <InputLabel id={id + "-select-label"}>{title}</InputLabel>
      <Select
        label={title}
        labelId={id + "-select-label"}
        id={id + "-select"}
        multiple
        value={currentItems}
        renderValue={renderValue}
        inputProps={{id: id + "-select-input"}}
        MenuProps={{variant: "menu"}}
      >
        <MenuItem
          value="all"
          classes={{
            root: isAllSelected ? classes.selectedAll : ""
          }}
          id={id + "-item-selectall"}
          onClick={handleSelectAll}
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
            <div key={index}>
              <CustomMenuItem title={val} id={id} index={index} default_checked={selectedSet.current!.has(index)} onSelected={handleChange} />
            </div>
          )
        })}
      </Select>
    </FormControl>
  );
},
(before, after) => {
  return before.default_selected === after.default_selected && before.items === after.items;
});

const CustomListItemText = memo((props: { title: string, id: string, index: number}) => {
  return (
    <ListItemText primary={props.title} id={props.id + "-text-" + props.index} />
  )
}, (before, after) => {
  return before.title === after.title;
})

const CustomMenuItem = memo((props: { title: string, id: string, index: number, default_checked: boolean, onSelected?: (index: number, checked: boolean) => void }) => {
  const { title, id, index, default_checked, onSelected } = props;
  const [checked, setChecked] = useState<boolean>(default_checked);

  useEffect(() => {
    setChecked(default_checked);
  }, [default_checked]);

  const onClicked = useCallback(() => {
    onSelected?.(index, !checked);
    setChecked(!checked);
  }, [checked, index, onSelected])

  return (
    <MenuItem key={index} value={title} id={id + "-item-" + index} onClick={onClicked}>
      <Checkbox checked={checked} id={id + "-checkbox-" + index} />
      <CustomListItemText title={title} id={id} index={index} />
    </MenuItem>
  )
},
(a, b) => {
  return a.title === b.title && a.default_checked === b.default_checked;
});

export default SearchSelect;