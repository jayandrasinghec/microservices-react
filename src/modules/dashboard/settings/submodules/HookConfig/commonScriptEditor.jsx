import React, { useState } from 'react';
import { FormControlLabel, Grid, makeStyles, Modal, Switch } from '@material-ui/core';
import AceEditor from "react-ace";
import 'ace-builds/webpack-resolver';
import CloseIcon from '@material-ui/icons/Close'
import ScrollWrapper from '../../../../../components/HOC/ScrollWrapper';
import CardViewWrapper from '../../../../../components/HOC/CardViewWrapper';
import FullScreen from '../../../../../assets/full-screen-white.svg'

const useStyles = makeStyles(() => ({
    // toggleTitle: {
    //   padding: '0px 20px 35px 0px'
    // },
    button: {
      float: 'right',
      borderRadius: '8px',
    },
    scriptEditor: {
      position: 'relative'
    },
    expandEditor: {
      position: 'absolute',
      width: '16px',
      height: '16px',
      cursor: 'pointer',
      top: 15,
      right: 20,
      opacity: 0,
      '&:hover': {
        opacity: 1
      }
    }
  }))

const CommonScriptEditor = ({openFullEditor,handleOpenFullEditor,handleCloseFullEditor,handleScriptOnChanges,script}) => {
  const classes = useStyles();    
  

    const ModalBody = (
        <div className="settings-add-new-global-modal" id="centralModalSm1" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document" style={{overflowy: 'initial !important'}}>
            <div className="modal-content p-2">
              <div className="modal-header pb-1">
                <h4 className="modal-title w-100 pb-2" id="myModalLabel">Script Editor</h4>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true"><CloseIcon style={{ cursor: 'pointer' }} onClick={handleCloseFullEditor} /></span>
                </button>
              </div>
              <div className="modal-body p-0" style={{ backgroundColor: '#E9EDF6', height: '73vh', overflowY: 'auto' }}>
                <AceEditor
                  mode={"java"}
                  theme="twilight"
                  onChange={handleScriptOnChanges}
                  value={script}
                  height="100%"
                  width="100%"
                  fontSize={14}
                  wrapEnabled={true}
                  enableBasicAutocompletion
                  enableLiveAutocompletion
                  name="UNIQUE_ID_OF_DIV"
                  editorProps={{ $blockScrolling: true }}
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true
                  }}
                />
              </div>
              <div className="modal-footer py-2">
                <button type="button" className="btn btn-left btn-sm ml-auto" onClick={handleCloseFullEditor}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )
    return (
        <>
        <Grid container>
          <Grid item xs={12}>
            <CardViewWrapper>                  
                  <Grid item xs={12}>
                    <Grid container spacing={3} alignItems="center" alignContent="center">
                      <Grid item xs={12} lg={3}>Script</Grid>
                      <Grid item xs={12} lg={9} className={classes.scriptEditor}>                        
                        <AceEditor
                          mode={"java"}
                          theme="twilight"
                          onChange={handleScriptOnChanges}
                          value={script}
                          height="200px"
                          width="100%"
                          fontSize={14}
                          wrapEnabled={true}
                          enableBasicAutocompletion
                          enableLiveAutocompletion
                          name="UNIQUE_ID_OF_DIV"
                          editorProps={{ $blockScrolling: true }}
                          setOptions={{
                            enableBasicAutocompletion: true,
                            enableLiveAutocompletion: true,
                            enableSnippets: true
                          }}
                        />
                        <img src={FullScreen} className={classes.expandEditor} onClick={handleOpenFullEditor} />
                      </Grid>
                    </Grid>
                  </Grid>
            </CardViewWrapper>
          </Grid>
        </Grid>
    
      <Modal open={openFullEditor} onClose={handleCloseFullEditor}>
        {ModalBody}
      </Modal>
    </> 
    )
}

export default CommonScriptEditor
