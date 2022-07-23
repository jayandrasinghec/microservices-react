import React from 'react'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import MuiDialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'


const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      backgroundColor: '#EEF1F8',
      padding: theme.spacing(2),
      paddingBottom: theme.spacing(1),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    content: {
      minWidth: 600,
      maxWidth: 700,
      display: 'flex',
      flexDirection: 'column',
      maxHeight: 500,
      // overflow: 'auto',
      backgroundColor: '#EEF1F8'
    }
  })


interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string
  children: React.ReactNode
  onClose: () => void
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  )
})


const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(1),
  },
}))(MuiDialogContent)


const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,backgroundColor: '#EEF1F8',
    padding: theme.spacing(1),
  },
}))(MuiDialogActions)


interface IProps {
  open: boolean
  onClose: () => void
  onScollEnd?: () => void
  title: string
  children: any
  actions?: any
  classes: any
}


const AppModal = (props: IProps) => {
  const onScroll = (e: any) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && props.onScollEnd) props.onScollEnd()
  }


  return (
    <Dialog onClose={props.onClose} open={props.open}>
      <DialogTitle id="app-modal" onClose={props.onClose}>
        {props.title}
      </DialogTitle>
      <DialogContent className={props.classes.content} onScroll={onScroll}>
        {props.children}
      </DialogContent>
      {props.actions && (<DialogActions>{props.actions}</DialogActions>)}
    </Dialog>
  )
}


export default withStyles(styles)(AppModal)