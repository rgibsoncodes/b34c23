import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: 600,
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: (props) => props.color,
    fontWeight: (props) => props.fontWeight,
    letterSpacing: -0.17,
  },
}));

const ChatContent = ({ conversation, isBold}) => {

  const styleProps = isBold ? {fontWeight: 700, color: "#000"} : {fontWeight: 600, color: "#9CADC8"};
  const classes = useStyles(styleProps);

  const { otherUser } = conversation;
  const latestMessageText = conversation.id && conversation.latestMessageText;

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={classes.previewText}>
          {latestMessageText}
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatContent;
