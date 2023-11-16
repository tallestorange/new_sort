import { useState, useEffect, memo, useCallback, useMemo, useRef } from "react";
import Select from '@material-ui/core/Select';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';

interface Props<T> {
  title: string;
  id: string;
  items: T[];
  default_selected: T[];
  title_convert_func: (input: T) => string;
  on_render_func: (input: T[]) => string;
  enabled: boolean;
  onValueChanged?: (items: T[]) => void;
}

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 450,
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

const SearchSelectBase = <T extends {unique_id: number}>(props: Props<T>) => {
  const { default_selected, onValueChanged, items, title, id, enabled, on_render_func } = props;
  const [currentItems, setCurrentItems] = useState<T[]>(default_selected);
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
    const tgt = items.map((v) => {return v.unique_id});
    for (let selected_item of default_selected) {
      selectedSet.current.add(tgt.indexOf(selected_item.unique_id));
    }
    setCurrentItems([...default_selected])
  }, [default_selected, items]);

  const renderValue = useCallback((selected: any) => {
    let result: T[] = selected;
    return on_render_func(result);
  }, [on_render_func]);

  const handleChange = useCallback((index: number, selected: boolean) => {
    if (selected) {
      selectedSet.current!.add(index);
    }
    else {
      selectedSet.current!.delete(index);
    }
    const after = Array.from(selectedSet.current!).map((v) => { return items[v] });
    setCurrentItems(after)
    onValueChanged?.(after);
  }, [items, onValueChanged])

  const handleSelectAll = useCallback(() => {
    if (isAllSelected) {
      selectedSet.current!.clear();
      setCurrentItems([])
      onValueChanged?.([])
    }
    else {
      selectedSet.current = new Set(allSelectedSet);
      setCurrentItems(items)
      onValueChanged?.(items)
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
          <Checkbox checked={isAllSelected} id={id + "-checkbox-selectall"} color="primary" />
          <SelectAllText id={id} />
        </MenuItem>
        {items.map((val, index) => {
          return (
            <div key={index}>
              <CustomMenuItem title={props.title_convert_func(val)} id={id} index={index} default_checked={selectedSet.current!.has(index)} onSelected={handleChange} />
            </div>
          )
        })}
      </Select>
    </FormControl>
  );
}

const SearchSelect = memo(SearchSelectBase,
(before, after) => {
  return before.default_selected === after.default_selected && before.items === after.items;
}) as typeof SearchSelectBase;

const CustomListItemText = memo((props: { title: string, id: string, index: number}) => {
  return (
    <ListItemText primary={props.title} id={props.id + "-text-" + props.index} />
  )
}, (before, after) => {
  return before.title === after.title;
})

const useStyles2 = makeStyles(() => ({
  selectAllText: {
    fontWeight: 700
  }
}));

const SelectAllText = memo((props: {id: string}) => {
  const classes = useStyles2();
  const {id} = props;
  return (
    <ListItemText
      classes={{ primary: classes.selectAllText }}
      primary="すべて選択する"
      id={id + "-text-selectall"}
    />
  )
},(a, b) => {
  return a.id === b.id;
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
      <Checkbox checked={checked} id={id + "-checkbox-" + index} color="primary" />
      <CustomListItemText title={title} id={id} index={index} />
    </MenuItem>
  )
},
(a, b) => {
  return a.title === b.title && a.default_checked === b.default_checked;
});

export default SearchSelect;