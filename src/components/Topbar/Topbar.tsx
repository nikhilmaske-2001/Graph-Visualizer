import React from 'react';
import clsx from "clsx";
import { LayoutType, getLayoutLabel } from "../../layout/layoutTypes";
import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core";
import SearchBar from "material-ui-search-bar";
import { Menu as MenuIcon } from "@material-ui/icons";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ColorButton, SelectedButton } from "../../utils/helperComponents";
import { useStyles } from '../../styles/useStyles';

const DEFAULT_LAYOUT_TYPE = LayoutType.Tree;

function Topbar() {
    const classes = useStyles();
    const [drawerOpen, setDrawerOpen] = React.useState(true);
    const [searchInputValue, setSearchInputValue] = React.useState("");
    const [selectedLayout, setSelectedLayout] = React.useState(DEFAULT_LAYOUT_TYPE);
    const [searchText, setSearchText] = React.useState("");

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
        </div>
    )
}

export default Topbar;
