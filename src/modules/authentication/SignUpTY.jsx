import React from 'react'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import ThanksYouLogo from '../../assets/ThanksYouLogo.png'
import BookmarkIcon from '@material-ui/icons/Bookmark'
import { getQueryString } from '../../utils/url'
import {CopyToClipboard} from 'react-copy-to-clipboard';

export default function SignUpTY(props) {
  const domain = getQueryString(props.location, 'domain')
  const email = getQueryString(props.location, 'email')
  const [copied, setCopy] = React.useState(false);
  const addToBookmarks = () => {
    const pageTitle = 'Cymmetry', pageURL = `${domain}.cymmetri.com`

    try {
      // Internet Explorer solution
      eval("window.external.AddFa-vorite(pageURL, pageTitle)".replace(/-/g, ''));
    }
    catch (e) {
      try {
        // Mozilla Firefox solution
        window.sidebar.addPanel(pageTitle, pageURL, "");
      }
      catch (e) {
        // The rest browsers (i.e Chrome, Safari)
        alert('Press ' + (navigator.userAgent.toLowerCase().indexOf('mac') != -1 ? 'Cmd' : 'Ctrl') + '+D to bookmark this page.');
      }
    }
  }

  return (
    <div style={{ textAlign: 'center', }}>
      <img src={ThanksYouLogo} style={{ width: '64px', height: '64px' }} />

      <h4 style={{ marginBottom: '25px' }}>Thank you for registering with us</h4>
      <h5>A confirmation email has been sent to {email}, follow the link in
        email to start using your Cymmetri account</h5>
      <p style={{ color: '#8392A7' }} className="medium_text">Did not receive the mail yet? check your spam</p>

      <TextField
        className="text-field" id="bookmark"
        variant="outlined" fullWidth value={`${domain}.cymmetri.com`} style={{ backgroundColor: '#F7F7F7' }} InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <BookmarkIcon onClick={addToBookmarks} />
              {/* <ClipboardCopy/> */}
            </InputAdornment>
          ),
        }} />
      <CopyToClipboard text={`${domain}.cymmetri.com`}
          onCopy={() => setCopy(true)}
          >
          <span style={{ color: '#8392A7' }} className="medium_text">{copied?'Copied...':'Copy to Clipboard, for ease access'}</span>
      </CopyToClipboard>
      {/* <p </p> */}
    </div>
  )
}