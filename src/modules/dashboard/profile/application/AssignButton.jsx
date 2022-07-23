import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import AssignUserApplicationView from '../../../../components/AssignUserApplicationView'
import AppModal from '../../../../components/AppModal'


const useStyles = makeStyles(() => ({
  button: {
    width: '180px',
    height: '32px',
    padding: 5
  }
}))


export default function AssignButton (props) {
  const classes = useStyles()

  const [open, setOpen] = React.useState(false)

  const handleModalOpen = () => setOpen(true)
  const handleModalClose = () => {setOpen(false); props.onUpdate()}

  return (
    <div>
      {/* <Button onClick={handleModalOpen} color="primary" variant="contained" className={classes.button}>Assign Application</Button> */}
      <div onClick={handleModalOpen} style={{ cursor: 'pointer',padding: '5px 15px', fontSize:'14px',alignItems:'center',justifyContent: 'center', display: 'flex' }} className="primary-btn-view">
        ASSIGN APPLICATION
      </div>
      <AppModal
        open={open}
        onClose={handleModalClose} title="Assign an Application">
        <AssignUserApplicationView onUpdate={props.onUpdate} userId={props.userId} updateUser={props.updateUser} />
      </AppModal>
    </div>
  )
}