import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  unreadBubble: {
    backgroundColor: "#0096FF",
    borderRadius: "30px",
    padding: "3px 9px",
    margin: 0,
    marginRight: "8px",
  },
  unreadBubbleText: {
    color: "white",
    padding: 0,
    margin: 0,
    fontWeight: 600,
  }
}));

const UnreadBubble = (props) => {
    const classes = useStyles();
    const { unreadMessages = 0 } = props;

    return (
      <div className={classes.unreadBubble}>
          <p className={classes.unreadBubbleText}>{unreadMessages}</p>
      </div>
    );
};

export default UnreadBubble;
