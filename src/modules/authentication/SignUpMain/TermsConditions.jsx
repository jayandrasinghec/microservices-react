import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox'
import { callApi } from '../../../utils/api'

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);


export default function TermsConditions(props) {
  const [terms, setTermsHTML] = React.useState('');
  const [termsId, setTermsId] = React.useState('');
  const [open, setOpen] = React.useState(false);

  // download the temrs on load
  React.useEffect(() => {
    const downloadTerms = () => callApi(`/regsrvc/getActiveTerms`).then(e => {setTermsHTML(e.data.terms_html_body);setTermsId(e.data.id)})
    downloadTerms()
  }, [])

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  return (
    <div>
      <Checkbox
        checked={!!props.form.term_condition_id}
        onChange={e => props.setForm({ term_condition_id: e.target.checked ? termsId : null })}
        color="primary" />
      <span style={{ color: '#A0A0A0', marginLeft: '10px', fontSize: 14 }}>
        I agree <span onClick={handleClickOpen} style={{ color: '#363793' }}>terms and conditions</span> of use
      </span>

      <Dialog
        fullWidth
        maxWidth="sm"
        onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Terms &amp; Conditions
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            <span dangerouslySetInnerHTML={{ __html: terms }} />
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
