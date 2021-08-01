import { Typography } from "@material-ui/core";
import { useStyles } from '../styles/useStyles';

function InputError() {
    const classes = useStyles();
    return (
        <div className={classes.layoutError}>
            <Typography color="secondary" variant="h6">
                {"<-- Enter a graph input."}
            </Typography>
        </div>
    )
}

export default InputError;
