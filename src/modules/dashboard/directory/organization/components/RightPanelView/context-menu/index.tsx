import React, { useEffect, useState } from "react";
 
import './styles.css';
import Input from '@material-ui/core/Input';
import { InputAdornment, TextField } from '@material-ui/core';
import { createStyles, SvgIconProps, Theme, Typography,makeStyles, Menu, MenuItem,IconButton } from "@material-ui/core";
import { connect } from "react-redux";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

interface Props {
options:any;
parentID:any
contextMenuSelected:any;
}

const ContextMenu: React.FC<Props> = (Props) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClose = () => {
        setAnchorEl(null);
      };
      const menuSelect = (option: any, id: any) => {
         Props.contextMenuSelected({option:option,itemID:id});
      };
      const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
      };

     
    return(
      <>
      <IconButton
      aria-label="settings"
      className=""
      onClick={handleClick}
    >
      <MoreHorizIcon />
    </IconButton>
        <Menu
                  id="long-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  anchorOrigin={{ vertical: "top", horizontal: "left" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  open={open}
                  onClose={handleClose}
                  PaperProps={{
                    style: {
                      // width: '20ch',
                    },
                  }}
                >
                 { Props.options.map((option:any) => (
                    <MenuItem
                      key={option}
                      onClick={(e: any) => menuSelect(option, Props.parentID)}
                    >
                      {option}
                    </MenuItem>
                  ))} 
                 </Menu>
                 </>
    )
}
export default ContextMenu;