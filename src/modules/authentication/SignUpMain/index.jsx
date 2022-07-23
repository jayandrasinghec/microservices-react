import React from 'react'
import validator from 'validator'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment'
import { callApi, callMasterApi } from '../../../utils/api'
import TermsConditions from './TermsConditions'

const defaultFormValues = {
  // tenantid: "cryptocontrol1",
}

export default function SignUp (props) {
  const [form, _setForm] = React.useState(defaultFormValues)
  const [errors, _setErrors] = React.useState({})
  const [isLoading, setLoading] = React.useState(false)
  const [countries, setCountries] = React.useState([])

  const downloadCountries = () => {
    callMasterApi(`/utilsrvc/meta/pub/list/country`, 'GET')
      .then(e => { if (e.success) {
        setCountries(e.data ? e.data : [])

      }})
  }

  React.useEffect(() => downloadCountries(), [])

  // api functions
  const checkDomainName = () => {
    if (!form.domain) return setError({ domain: 'Domain is required' })
    callApi(`/regsrvc/checkDomain/${form.domain}`)
      .then(e => setError({ domain: e.success ? null : 'Domain is already in use' }))
      .catch(() => setError({ domain: 'Domain is already in use' }))
  }

  const submitRegistrationForm = () => {
    setLoading(true)

    const data = {
      ...form,
      domain: `${form.domain}.cymmetri.com`
    }

    callMasterApi(`/regsrvc/signUp`, 'POST', data)
      .then(e => {
        setLoading(false)
        if (e.success) props.history.push(`/auth/signup/thank_you?email=${form.work_email}&domain=${form.domain}`)
      })
      .catch(() => setLoading(false))
  }

  // validation functions
  const setForm = e => _setForm({ ...form, ...e })
  const setError = e => _setErrors({ ...errors, ...e })

  const checkEmail = () => {
    setError({ work_email: validator.isEmail(form.work_email || '') ? null : 'Please enter a valid email' })

    var email = form.work_email || '';
    var domain = email.replace(/.*@/, "");
    const _tld = domain.split('.')
    _tld.pop()
    const tld = _tld.join('-') + '.cymmetri.com'

    callApi(`/regsrvc/checkDomain/${tld}`)
    .then(e => {
      if (e.success) setForm({ domain: _tld.join('-'), tenantid: _tld })
    })
  }

  const checkFname = () => setError({ firstname: (form.firstname || '').length > 1 ? null : 'First name is required' })
  const checkLname = () => setError({ lastname: (form.lastname || '').length > 1 ? null : 'Last name is required' })

  const isValid = !Object.values(errors).some(e => e != null) &&
    form.country &&
    !!form.term_condition_id

  const onKeyD = (event) => {
    if (event.key === 'Enter' && isValid) {
      event.preventDefault();
      event.stopPropagation();
      submitRegistrationForm();
    }
  }

  return (
    <div>
      <h2 className="mb-1 mb-3">Sign Up</h2>
      <TextField
        value={form.work_email}
        name="email"
        error={!!errors.work_email}
        onBlur={checkEmail}
        helperText={errors.work_email}
        onChange={e => setForm({ work_email: e.target.value })}
        className="text-field" label="Work Email"
        variant="outlined" fullWidth />

      <TextField
        value={form.firstname}
        name="first_name"
        error={!!errors.firstname}
        onBlur={checkFname}
        helperText={errors.firstname}
        onChange={e => setForm({ firstname: e.target.value })}
        className="text-field" label="First Name"
        variant="outlined" fullWidth />

      <TextField
        value={form.lastname}
        name="last_name"
        error={!!errors.lastname}
        onBlur={checkLname}
        helperText={errors.lastname}
        onChange={e => setForm({ lastname: e.target.value })}
        className="text-field" label="Last Name"
        variant="outlined" fullWidth />

      <TextField
        value={form.mobile}
        name="phone"
        error={!!errors.mobile}
        type="number"
        min={0}
        // onBlur={checkFname}
        helperText={errors.mobile}
        onChange={e => setForm({ mobile: e.target.value })}
        className="text-field" label="Phone Number"
        variant="outlined" fullWidth />

      <TextField
        value={form.domain}
        name="domain"
        onChange={e => setForm({ domain: e.target.value })}
        style={{ backgroundColor: '#eee' }}
        inputProps={{ style: { backgroundColor: '#fff' }}}
        className="text-field" label="Domain"
        error={errors.domain}
        onBlur={checkDomainName}
        helperText={errors.domain}
        variant="outlined"
        shrink
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <div style={{ color: '#929699' }}>.cymmetri.com</div>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        name="country"
        value={form.country}
        autoComplete={false}
        onKeyDown={(e) => onKeyD(e)}
        onChange={e => setForm({ country: e.target.value })}
        className="text-field" label="Select Country"
        variant="outlined" select fullWidth>
        {countries.map(o => <MenuItem key={o.id} value={o.name}>{o.name}</MenuItem>)}
      </TextField>

      <TermsConditions form={form} setForm={setForm} />

      <Button
        onClick={submitRegistrationForm}
        variant="contained"
        disabled={!isValid || isLoading}
        color="primary"
        style={{ float: 'right' }}>
        { !isLoading ? 'Register' : 'Loading...' }
      </Button>
    </div>
  )
}
