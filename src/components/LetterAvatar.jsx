import React from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import { deepOrange, deepPurple, red, blue, green } from '@material-ui/core/colors'
import Badge from '@material-ui/core/Badge';

const useStyles = makeStyles((theme) => ({
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  blue: {
    color: theme.palette.getContrastText(blue[500]),
    backgroundColor: blue[500],
  },
  green: {
    color: theme.palette.getContrastText(green[500]),
    backgroundColor: green[500],
  },
  red: {
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
  customBadge: {
    backgroundColor: "#00AFD7",
    color: "white"
  }
}))

const StyledBadge = withStyles((theme) => ({
  badge: {
    // boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      // position: 'absolute',
      // top: 0,
      // left: 0,
      // width: '100%',
      // height: '100%',
      borderRadius: '50%',
      // animation: '$ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      // content: '""',
    },
  },
  // '@keyframes ripple': {
  //   '0%': {
  //     transform: 'scale(.8)',
  //     opacity: 1,
  //   },
  //   '100%': {
  //     transform: 'scale(2.4)',
  //     opacity: 0,
  //   },
  // },
}))(Badge);

export default function LetterAvatar (props) {
  const classes = useStyles()
  var character = props.text.match(/\b\w/g) || [];
  character = ((character.shift() || '') + (character.pop() || '')).toUpperCase();
  const status = props.status
  const profileImage = props.profileImage
  const options = ['#666']
  const classSelected = options[character.charCodeAt(0) % options.length]
  const statusColour =  (status === 'ACTIVE') ? 'green' : (status === 'INACTIVE') ? 'red' : 'purple'
  return(
    <StyledBadge
      badgeContent=" "
      overlap="circle"
      variant={props.variant}
      classes={{ badge: classes[statusColour] }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}>
      {
        profileImage && profileImage!=='' ?  
        <Avatar style={props.style} className={[props.className, classes[classSelected]]} src={`data:image/jpeg;base64,${profileImage}`}/> : 
        <Avatar style={props.style} className={[props.className, classes[classSelected]]}>{character}</Avatar>
      } 
    </StyledBadge>
  )
}