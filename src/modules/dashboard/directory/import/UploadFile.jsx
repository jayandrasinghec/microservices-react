import React, { useState } from 'react'
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import { Grid, makeStyles } from '@material-ui/core';
import { DropzoneArea } from 'material-ui-dropzone';
import AppSelectInput from '../../../../components/form/AppSelectInput';
import AppTextInput from '../../../../components/form/AppTextInput';
import { callApi, search } from '../../../../utils/api';
import { showError, showSuccess } from '../../../../utils/notifications';
import { getAuthToken } from '../../../../utils/auth';
import GetAppIcon from '@material-ui/icons/GetApp';
import SampleUsersImport from '../../../../assets/sample.csv'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flex: 1,
    // maxHeight: 500,
    flexDirection: 'column',
    width: '100%',
    overflow: 'hidden',
    marginBottom: '20px'
  },
  container: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: 15,
    // height: '300px',
    // alignContent: 'center',
    // alignItems: 'center'
    // overflow: 'auto'
  },
  button: {
    borderRadius: '8px',
    float: 'right'
  },
  previewChip: {
    minWidth: 160,
    maxWidth: 210
  },
}))

const defaultFormData = {
  file: [],
  encoding: '',
  delimiter: '',
  qualifier: '',
  isHeaderInclude: false,
  dateFormatter: ''
}

export default function UploadFile(props) {

  const classes = useStyles();
  const [formData, setFormData] = useState(defaultFormData)
  const [saving, setSaving] = useState(false)
  // const [resultData, setResultData] = useState([])
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true)
    const localToken = `Bearer ${getAuthToken()}`
    let myHeaders = new Headers();

    myHeaders.append("Authorization", localToken );

    let formdata = new FormData();
    formdata.append("file", formData.file, formData.file.name);
    formdata.append("encoding", formData.encoding);
    formdata.append("delimiter", formData.delimiter);
    formdata.append("qualifier", formData.qualifier);
    formdata.append("isHeaderInclude", formData.isHeaderInclude);
    formdata.append("dateFormatter", formData.dateFormatter);

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch("/usersrvc/import/users/uploadFileAndMetadata", requestOptions)
      .then(response => response.json())
      .then(result => {
        setSaving(false)
        if(result.success) {
          props.handleData(result.data)
          // setResultData(result.data)
          showSuccess("File uploaded successfully")
          props.history.push({
            pathname: `/dash/directory/import/users/${result.data.id}/info`,
            // state: {data : result.data}
          })
        } else{
            const value = search(result.errorCode);
            const message = value ? value : result.errorCode
            showError(message)
        }
      })
      .catch(error => setSaving(false));
  }



  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Grid item className="text-right">
          <Button
            className="mb-2 mx-2"
            startIcon={<GetAppIcon
            style={{ color: '#363793' }} />}
            style={{ color: '#363793' }}
            href={SampleUsersImport}
            download='sample.csv'
          >
              Sample CSV 
          </Button>
        </Grid>
        <Grid container spacing={3} className="p-3">
          {/* <Button
            variant="contained" 
            className={classes.button}
            color="primary"
            component="label"
          >
            Upload File
            <input
              type="file"
              style={{ display: "none" }}
            />
          </Button> */}
          {/* <input type="file" accept=".csv" /> */}
          <DropzoneArea
            // dropzoneText={"Drag and drop an image here or click"}
            acceptedFiles={['.csv','.txt']}
            filesLimit={1}
            showAlerts={false}
            maxFileSize={12000000}
            showPreviews={true}
            showPreviewsInDropzone={false}
            useChipsForPreview
            previewGridProps={{container: { spacing: 1, direction: 'row' }}}
            previewChipProps={{classes: { root: classes.previewChip } }}
            previewText="Selected files"
            onChange={(files) => setFormData({...formData, file: files[0]})}
          />
        </Grid>
        <Grid container spacing={3} className="p-3">
          {/* <AssignGroupsUserView userId={props.match.params.id} {...props} /> */}
          <Grid item xs={6}>
            <AppSelectInput
              required
              value={formData.encoding}
              onChange={e => {
                setFormData({...formData, encoding: e.target.value})
              }}
              label={`File Encoding`}
              // labels={questions.map(q => q.question)}
              options={['UTF_8', 'US_ASCII', 'ISO_8859_1', 'UTF_16', 'UTF_16BE', 'UTF_16LE']}
              // style={{ width: 350 }}
            />
          </Grid>
          <Grid item xs={6}>
            <AppSelectInput
              required
              value={formData.delimiter}
              onChange={e => setFormData({...formData, delimiter: e.target.value})}
              label={`Fields Delimited By`}
              options={['COMMA', 'TAB', 'SEMICOLON', 'SPACE']}
              // style={{ width: 350 }}
            />
          </Grid>
          <Grid item xs={6}>
            <AppSelectInput
              required
              value={formData.qualifier}
              onChange={e => setFormData({...formData, qualifier: e.target.value})}
              label={`Fields qualifier By`}
              options={['BACKTICK', 'SINGLE_QUOTED', 'DOUBLE_QUOTED', 'NON_QUOTED']}
              labels={['Backtick (`)', "Single Quoted (')", 'Double Quoted (")', 'Non Quoted']}
              // style={{ width: 350 }}
            />
          </Grid>
          <Grid item xs={6}>
            <AppSelectInput
              value={formData.dateFormatter}
              onChange={e => setFormData({...formData, dateFormatter: e.target.value})}
              label={`Date Formatter`}
              options={["dd/MM/yyyy HH:mm:ss"]}
              labels={["dd/MM/yyyy HH:mm:ss"]}
              // style={{ width: 350 }}
            />
          </Grid>
          <Grid item xs={6}>
            <div className="custom-checkbox mt-3">
              <input
                type="checkbox"
                name="header"
                id="header"
                value={formData.isHeaderInclude}
                onChange={e => setFormData({...formData, isHeaderInclude: e.target.checked ? 'true' : 'false'})}
              /> 
              <label className='text-dark' htmlFor="header"><b>Header Row</b></label>
            </div>
          </Grid>
        </Grid>
        <Button 
          variant="contained" 
          className={clsx(classes.button, "mt-3")}
          color="primary"
          disabled={!formData.file || !formData.encoding || !formData.delimiter || !formData.qualifier || saving}
          onClick={handleSubmit}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
