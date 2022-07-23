import React from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider'
import InputAdornment from '@material-ui/core/InputAdornment';
import VerifyKey from '../../assets/VerifyKey.png'


export default function SignUpTY() {
  return (
    <div>
      <h2>Verify</h2>
      <p className="medium_text" style={{ marginBottom: '50px' }}>Enter the access code that was sent to you.</p>
      <TextField className="text-field" id="bookmark"
        variant="outlined" fullWidth placeholder="Enter SMS Code" style={{ marginBottom: '30px' }} InputProps={{
          startAdornment: (
            <div>
              <InputAdornment position="start">
                <img src={VerifyKey} />
              </InputAdornment>
              <Divider orientation="vertical" flexItem />
            </div>
          ),
        }} />

      <Button variant="contained" style={{ float: 'right', borderRadius: '8px', backgroundColor: '#363795', color: 'white' }}>Verify</Button>
    </div>
  )
}