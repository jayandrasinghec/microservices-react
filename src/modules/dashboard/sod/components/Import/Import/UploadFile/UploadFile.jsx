import React, { useEffect, useState } from 'react';
import { Button, Checkbox, FormControlLabel, Grid, makeStyles } from '@material-ui/core';
import { GetApp } from '@material-ui/icons';
import { DropzoneArea } from 'material-ui-dropzone';
import AppSelectInput from '../../../../../../../components/form/AppSelectInput';
import CardViewWrapper from '../../../../../../../components/HOC/CardViewWrapper';
import { useHistory } from 'react-router';
import { showSuccess, showError } from '../../../../../../../utils/notifications';
import { callApi, search } from '../../../../../../../utils/api';
import { getAuthToken } from '../../../../../../../utils/auth';
import SodImportEntitesCsv from '../../../../../../../assets/sod_import_entities.csv';
import SodImportPoliciesCsv from '../../../../../../../assets/sod_import_policy_rule.csv';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  button: {
    borderRadius: '8px',
    float: 'right'
  },
  previewChip: {
    minWidth: 160,
    maxWidth: 210
  },
}))

const defaultFileData = {
  file: [],
  encoding: '',
  delimiter: '',
  qualifier: '',
  isHeaderInclude: false,
  dateFormatter: ''
}

const UploadFile = ({ setActiveStep, setUploadData }) => {
  const classes = useStyles();
  const history = useHistory();
  const { type } = useParams();

  const [fileData, setFileData] = useState(defaultFileData);
  const [saving, setSaving] = useState(false);
  const [errors, _setErrors] = useState({});

  // useEffect(() => {
  //   if(!id && id === null && id === undefined && id === ''){
  //     history.push('/dash/sod/import'); 
  //   }
  // }, [id])

  const setError = e => _setErrors({ ...errors, ...e })

  const isValid = fileData.file  && fileData.encoding && fileData.delimiter && fileData.qualifier && type;
  
  const checkType = () => setError({ type: (type || '').length > 1 ? null : 'SOD type is required' });
  const checkEncoding = () => setError({ encoding: (fileData.encoding || '').length > 1 ? null : 'File Encoding is required' });
  const checkDelimiter = () => setError({ delimiter: (fileData.delimiter || '').length > 1 ? null : 'Fields Delimiter by is required' });
  const checkQualifier = () => setError({ qualifier: (fileData.qualifier || '').length > 1 ? null : 'Fields qualifier by type is required' });

  const handleFileUpload = (e) => {
    // e.preventDefault();
    setSaving(true)
    const localToken = `Bearer ${getAuthToken()}`
    let myHeaders = new Headers();

    myHeaders.append("Authorization", localToken );

    let formdata = new FormData();
    formdata.append("file", fileData.file, fileData.file.name);
    formdata.append("encoding", fileData.encoding);
    formdata.append("delimiter", fileData.delimiter);
    formdata.append("qualifier", fileData.qualifier);
    formdata.append("isHeaderInclude", fileData.isHeaderInclude);
    formdata.append("dateFormatter", fileData.dateFormatter);

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    let url = ''
    if(type === 'entities'){
      url = '/sod/import/sodentities/uploadFileAndMetadata'
    }
    if(type === 'policies'){
      url = '/sod/import/policyRule/uploadFileAndMetadata'
    }

    fetch(url, requestOptions)
      .then(response => response.json())
      .then(result => {
        setSaving(false)
        if(result.success) {
          setUploadData(result.data)
          showSuccess("File uploaded successfully")
          history.push({
            pathname: `/dash/sod/import/${type}/file/info`,
            state: { id : result.data.id }
          })
        } else{
            const value = search(result.errorCode);
            const message = value ? value : result.errorCode
            showError(message)
        }
      })
      .catch(error => setSaving(false));
  }

  return(
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <CardViewWrapper>
          <Grid container spacing={2} alignItems='center'>
            <Grid item xs={12}>
              <Button 
                style={{ float: 'right' }}
                type='contained' 
                color='primary' 
                startIcon={<GetApp />}
                href={type === 'entities' ? SodImportEntitesCsv : SodImportPoliciesCsv}
                download={type === 'entities' ? 'SodImportEntites.csv' : 'SodImportPolicies.csv'}>
                  Sample CSV
              </Button>
            </Grid>
            <Grid item xs={12}>
              <DropzoneArea 
                acceptedFiles={['.csv','.txt']}
                filesLimit={1}
                showAlerts={false}
                maxFileSize={12000000}
                showPreviews={true}
                showPreviewsInDropzone={false}
                useChipsForPreview
                previewGridProps={{container: { spacing: 1, direction: 'row' }}}
                previewChipProps={{classes: { root: classes.previewChip } }}
                previewText="Uploaded file"
                onChange={(files) => setFileData({...fileData, file: files[0]})}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <AppSelectInput 
                label='File Encoding'
                required
                value={fileData.encoding}
                options={['UTF_8', 'US_ASCII', 'ISO_8859_1', 'UTF_16', 'UTF_16BE', 'UTF_16LE']}
                onChange={e => setFileData({...fileData, encoding: e.target.value})}
                error={!!errors.encoding}
                helperText={errors.encoding}
                onBlur={checkEncoding}
              />
            </Grid>
            <Grid item xs={6}>
              <AppSelectInput 
                label='Fields Delimited By'
                required
                value={fileData.delimiter}
                options={['COMMA', 'TAB', 'SEMICOLON', 'SPACE']}
                onChange={e => setFileData({...fileData, delimiter: e.target.value})}
                error={!!errors.delimiter}
                helperText={errors.delimiter}
                onBlur={checkDelimiter}
              />
            </Grid>
            <Grid item xs={6}>
              <AppSelectInput 
                label='Fields qualifier By'
                required
                value={fileData.qualifier}
                options={['BACKTICK', 'SINGLE_QUOTED', 'DOUBLE_QUOTED', 'NON_QUOTED']}
                labels={['Backtick (`)', "Single Quoted (')", 'Double Quoted (")', 'Non Quoted']}
                onChange={e => setFileData({...fileData, qualifier: e.target.value})}
                error={!!errors.qualifier}
                helperText={errors.qualifier}
                onBlur={checkQualifier}
              />
            </Grid>
            <Grid item xs={6}>
              <AppSelectInput 
                label='Date Formatter'
                value={fileData.dateFormatter}
                options={["dd/MM/yyyy HH:mm:ss"]}
                labels={["dd/MM/yyyy HH:mm:ss"]}
                onChange={e => setFileData({...fileData, dateFormatter: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel 
                label='Header Row'
                control={<Checkbox 
                  color='primary'
                  value={fileData.isHeaderInclude}
                  onChange={e => setFileData({...fileData, isHeaderInclude: e.target.checked ? 'true' : 'false'})}
                />}
              />
            </Grid>
            <Grid item xs={12}>
              <Grid container justify='space-between'>
                <Grid item>
                  <Button className={classes.button} onClick={() => history.push('/dash/sod/import')}>Discard</Button>
                </Grid>
                <Grid item>
                  <Button 
                    className={classes.button} 
                    variant='contained' 
                    color='primary'
                    disabled={!isValid || saving}
                    onClick={handleFileUpload}>
                      Next
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardViewWrapper>
      </Grid>
    </Grid>
  );
}

export default UploadFile;