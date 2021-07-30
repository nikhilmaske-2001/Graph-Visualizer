import React from "react";
import { Button, Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Help as HelpIcon } from "@material-ui/icons";

export const LabelWithTooltip = ({
    tooltipText,
    label,
    inputRef
}: {
    tooltipText: string;
    label: string;
    inputRef: React.RefObject<HTMLInputElement>;
}) => {
    return (
        <div
            onClick={() => {
                if (inputRef && inputRef.current) {
                    inputRef.current.focus();
                }
            }}
        >
            {label}
            <Tooltip
                style={{ height: "20px", margin: "0px 0px -4px 4px" }}
                title={tooltipText}
                placement="right"
            >
                <HelpIcon />
            </Tooltip>
        </div>
    );
};

const lightred = "#e83838";
const red = "#e60e0e";
const lightGrey = "#eeeeee";

export const ColorButton = withStyles(theme => ({
    root: {
        color: theme.palette.getContrastText(lightGrey),
        backgroundColor: lightGrey,
        "&:hover": {
            backgroundColor: lightred
        }
    }
}))(Button);

export const SelectedButton = withStyles(theme => ({
    root: {
        color: theme.palette.getContrastText(red),
        backgroundColor: red,
        "&:hover": {
            backgroundColor: red
        }
    }
}))(Button);