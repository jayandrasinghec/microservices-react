import React from 'react'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import InputAdornment from '@material-ui/core/InputAdornment'
import { callApi } from '../../utils/api'



const countries = [
  {
    value: 'India',
    label: 'India'
  },
  {
    value: 'Sri Lanka',
    label: 'Sri Lanka'
  }
]


export default function SignUp() {
  const [agree, setAgree] = React.useState(false)
  const [form, setForm] = React.useState({})

  const handleChange = (event) => setAgree(event.target.checked)
  const update = (val) => setForm({ ...form, ...val })

  const checkDomainName = () => {
    callApi(`/regsrvc/checkDomain/${form.domain}`)
      // .then(console.log)
      .then()
  }

  const valid = form.email && form.firstname && form.lastname &&
    form.domain && form.country && agree

  return (
    <div>
      <h2>Sign Up</h2>
      <TextField
        value={form.work_email}
        name="email"
        onChange={e => update({ work_email: e.target.value })}
        className="text-field" label="Work Email"
        variant="outlined" fullWidth />

      <TextField
        name="first_name"
        value={form.firstname}
        onChange={e => update({ firstname: e.target.value })}
        className="text-field" label="First Name"
        variant="outlined" fullWidth />

      <TextField
        name="last_name"
        value={form.lastname}
        onChange={e => update({ lastname: e.target.value })}
        className="text-field" label="Last Name"
        variant="outlined" fullWidth />

      <TextField
        value={form.domain}
        onChange={e => update({ domain: e.target.value })}
        style={{ backgroundColor: '#eee' }}
        inputProps={{ style: { backgroundColor: '#fff' }}}
        className="text-field" label="Domain"
        onBlur={checkDomainName}
        variant="outlined"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <div style={{ color: '#929699' }}>.cymmetri.com</div>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        value={form.country}
        onChange={e => update({ country: e.target.value })}
        className="text-field" label="Select Country"
        variant="outlined" select fullWidth>
        {countries.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
      </TextField>

      <div>
        <Checkbox
          checked={agree}
          onChange={handleChange}
          defaultChecked
          color="primary" />
        <p style={{ color: '#A0A0A0', marginLeft: '10px', fontSize: 14 }}> I agree <span style={{ color: '#363793' }}>terms and conditions</span> of use</p>
      </div>

      <Button
        variant="contained"
        disabled={!valid}
        color="primary"
        style={{ float: 'right' }}>
        Register
      </Button>
    </div>
  )
}
