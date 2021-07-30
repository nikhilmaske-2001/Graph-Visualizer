import React from 'react';
import clsx from "clsx";
import { LayoutType, getLayoutLabel } from "../../layout/layoutTypes";
import { AppBar, Checkbox, Divider, Drawer, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, Select, TextField, Toolbar, Typography } from "@material-ui/core";
import SearchBar from "material-ui-search-bar";
import { Menu as MenuIcon } from "@material-ui/icons";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ColorButton, LabelWithTooltip, SelectedButton } from "../../utils/helperComponents";
import { useStyles } from '../../styles/useStyles';
import { ChevronLeft as ChevronLeftIcon } from "@material-ui/icons";
import { Autocomplete } from '@material-ui/lab';
import { InputType } from "../../parser/inputTypes";
import { getLabel } from '../../parser/inputTypes';



const DEFAULT_LAYOUT_TYPE = LayoutType.Tree;
const DEFAULT_INPUT_TYPE = InputType.AdjacencyList;
const DEFAULT_GRAPH_INPUT = ``;


function Topbar() {
    const classes = useStyles();
    const [drawerOpen, setDrawerOpen] = React.useState(true);
    const [searchInputValue, setSearchInputValue] = React.useState("");
    const [selectedLayout, setSelectedLayout] = React.useState(DEFAULT_LAYOUT_TYPE);
    const [searchText, setSearchText] = React.useState("");
    const [inputValue, setInputValue] = React.useState(DEFAULT_GRAPH_INPUT);
    const [comboValue, setComboValue] = React.useState(DEFAULT_INPUT_TYPE);
    // input data
    const [directed, setDirected] = React.useState(true);
    const [oneIndexed, setOneIndexed] = React.useState(false); // used for adjacency lists
    const [reverseEdges, setReverseEdges] = React.useState(false); // used for edge pairs
    const [customNodes, setCustomNodes] = React.useState(DEFAULT_GRAPH_INPUT);


    const graphInputRef = React.useRef<any>();
    const customNodesInputRef = React.useRef<any>();

    const [startNode, setStartNode] = React.useState<string | null>(null);

    const [allNodes, setAllNodes] = React.useState<Array<string>>([]);


    // error handling
    const [graphInputError, setGraphInputError] = React.useState("");
    const [customNodesInputError, setCustomNodesInputError] = React.useState("");

    return (
        <div>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: drawerOpen
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => {
                            setDrawerOpen(true);
                        }}
                        edge="start"
                        className={clsx(classes.menuButton, drawerOpen && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Choose Layout Type:
                    </Typography>
                    {Object.keys(LayoutType)
                        .filter(k => typeof LayoutType[k as any] !== "number")
                        .map(key => {
                            let currLayoutType = parseInt(key);
                            return currLayoutType === selectedLayout ? (
                                <SelectedButton
                                    key={key}
                                    className={classes.layoutButton}
                                    variant="contained"
                                    onClick={() => {
                                        setSelectedLayout(currLayoutType);
                                    }}
                                >
                                    {getLayoutLabel(parseInt(key))}
                                </SelectedButton>
                            ) : (
                                <ColorButton
                                    key={key}
                                    className={classes.layoutButton}
                                    variant="contained"
                                    onClick={() => {
                                        setSelectedLayout(currLayoutType);
                                    }}
                                >
                                    {getLayoutLabel(parseInt(key))}
                                </ColorButton>
                            );
                        })}
                    <div className={classes.searchBar}>
                        <SearchBar
                            value={searchInputValue}
                            onChange={newValue => setSearchInputValue(newValue)}
                            onRequestSearch={() => setSearchText(searchInputValue)}
                            onCancelSearch={() => setSearchText("")}
                            placeholder={"Search Nodes"}
                            style={{
                                width: 200,
                                height: 36
                            }}
                        />
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={drawerOpen}
                classes={{
                    paper: classes.drawerPaper
                }}
            >
                <div className={classes.drawerHeader}>
                    <Typography className={classes.drawerHeaderText} variant="h6" noWrap>
                        Graph Input
                    </Typography>
                    <IconButton
                        onClick={() => {
                            setDrawerOpen(false);
                        }}
                    >
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <div>
                    <Divider />
                    <FormControl className={classes.formControl}>
                        <TextField
                            InputLabelProps={{ style: { pointerEvents: "auto" } }}
                            label={
                                <LabelWithTooltip
                                    label={"Graph Input"}
                                    tooltipText={"Enter the text representation of the graph."}
                                    inputRef={graphInputRef}
                                />
                            }
                            inputRef={graphInputRef}
                            placeholder="Please enter graph input."
                            multiline
                            rows={3}
                            rowsMax={10}
                            variant="outlined"
                            value={inputValue}
                            onChange={event => {
                                setInputValue(event.target.value);
                            }}
                            error={graphInputError.length > 0}
                            helperText={graphInputError}
                        />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="graph-input-type-label">Input Type</InputLabel>
                        <Select
                            labelId="graph-input-type-label"
                            id="graph-input-type"
                            value={comboValue}
                            className={classes.selectEmpty}
                            variant="outlined"
                            onChange={e => {
                                setComboValue(parseInt(e.target.value as string));
                            }}
                        >
                            {Object.keys(InputType)
                                .filter(k => typeof InputType[k as any] !== "number")
                                .sort((a, b) => getLabel(parseInt(a)).localeCompare(getLabel(parseInt(b))))
                                .map(key => (
                                    <MenuItem key={key} value={key}>
                                        {getLabel(parseInt(key))}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                    {comboValue === InputType.AdjacencyList && (
                        <FormControlLabel
                            className={classes.formControlLabel}
                            control={
                                <Checkbox
                                    checked={oneIndexed}
                                    onChange={e => setOneIndexed(!oneIndexed)}
                                    name="oneIndexedValue"
                                    color="primary"
                                />
                            }
                            label="1-indexed"
                        />
                    )}
                    {comboValue === InputType.EdgePairs && (
                        <FormControlLabel
                            className={classes.formControlLabel}
                            control={
                                <Checkbox
                                    checked={reverseEdges}
                                    onChange={e => setReverseEdges(!reverseEdges)}
                                    name="reverseValue"
                                    color="primary"
                                />
                            }
                            label="Reverse"
                        />
                    )}
                    <FormControlLabel
                        className={classes.formControlLabel}
                        control={
                            <Checkbox
                                checked={directed}
                                onChange={e => setDirected(!directed)}
                                name="directedValue"
                                color="primary"
                            />
                        }
                        label="Directed"
                    />
                    <FormControl className={classes.formControl}>
                        <Autocomplete
                            options={allNodes}
                            value={startNode && startNode.length > 0 ? startNode : null}
                            onChange={(event: React.ChangeEvent<{}>, newValue: string | null) => {
                                if (newValue) setStartNode(newValue);
                            }}
                            renderInput={(params: any) => (
                                <TextField {...params} label="Start Node" margin="normal" variant="outlined" />
                            )}
                        />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <TextField
                            InputLabelProps={{ style: { pointerEvents: "auto" } }}
                            label={
                                <LabelWithTooltip
                                    label={"Custom Node List"}
                                    tooltipText={
                                        "(Optional) Specify if the set of nodes is described in a separate list from the edges."
                                    }
                                    inputRef={customNodesInputRef}
                                />
                            }
                            inputRef={customNodesInputRef}
                            placeholder="Enter custom node set here."
                            multiline
                            rows={3}
                            rowsMax={10}
                            variant="outlined"
                            value={customNodes}
                            onChange={event => {
                                setCustomNodes(event.target.value);
                            }}
                            error={customNodesInputError.length > 0}
                            helperText={customNodesInputError}
                        />
                    </FormControl>
                </div>
            </Drawer>
        </div>
    )
}

export default Topbar;
