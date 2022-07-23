import React from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import * as _ from 'underscore'
import { makeStyles } from '@material-ui/core/styles'
import jwt from 'jsonwebtoken'

import { callApi } from '../../utils/api'
import AppSelectInput from '../../components/form/AppSelectInput'
import AppTextInput from '../../components/form/AppTextInput'
import Edit from '../../FrontendDesigns/new/assets/img/icons/edit.svg'
import { decideToken } from './_decide'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import { getAuthToken } from '../../utils/auth'

const defaultFormValues = {
  // login: 'manojb2',
  // password: 'szDi6aiD7BcJooTVpZq+fQ=='
  // // tenantid: "cryptocontrol1",
}

const useStyles = makeStyles(() => ({
  textField: {
    backgroundColor: '#F7F7F7',
  },
  label: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 5
  },
  input: {
    height: 40
  },
  multilineInput: {
    // height: 33
  },
}))

export default function SignUpQuestions(props) {
  const classes = useStyles();
  const [agree, setAgree] = React.useState(false)
  const [answers, setAnswers] = React.useState('')
  const [sqr, setSqr] = React.useState([])
  const [maxQuestions, setMaxQuestions] = React.useState(0)
  const [questions, setQuestions] = React.useState([])
  const [questionsAns, setQuestionsAns] = React.useState([])
  const handleChange = (event) => setAgree(event.target.checked)
  const [form, _setForm] = React.useState(defaultFormValues)
  const [errors, _setErrors] = React.useState({})
  const [isLoading, setLoading] = React.useState(false)
  // const [flow, setFlow] = React.useState()

  const [questionsLen, setQuestionsLen] = React.useState([{ type: null }])
  const [disabledQ, setDisabledQ] = React.useState(true)
  const [disabledA, setDisabledA] = React.useState(true)

  const onSave = (index) => {
    if (index < questionsLen.length - 1) {
      questionsLen[index].type = 'editable'
      setQuestionsLen([...questionsLen])
    } else {
      questionsLen.forEach(q => (q.type = 'editable'))
      if (questionsLen.length === maxQuestions) return setQuestionsLen([...questionsLen])
      setQuestionsLen([...questionsLen, { type: null }])
    }
    setDisabledA(true)
  }

  const onEditClick = (index) => {
    let newArr = [...questionsLen];
    newArr[index].type = null;
    setQuestionsLen(newArr);
    setDisabledA(true)
  }

  const downloadQuestions = async () => {
    // setLoading(true)

    callApi(`/mfasrvc/mfaConfig/securityQuestionConfig`, 'GET')
      .then(e => {

        if (e.success) {
          const maxQuestions = e.data.noOfQuestionToConfigure || 1
          setMaxQuestions(maxQuestions)

          callApi(`/mfasrvc/questionBank/findAllActive`, 'GET')
            .then(e => {
              setQuestions(e.data)
              // setSqr(e.data.map(d => ({ questionId: d.id, answer: '' })))
              // setSqr(_.first(e.data.map(d => ({questionId: d.id, answer: ''}), maxQuestions)))
              // console.log(_.first(e.data.map(() => ({}), maxQuestions)))
            })
        }
      })
  }

  const submitAnswers = async () => {
    const body = {
      "sqr": sqr
    }

    const token = getAuthToken()
    const jwtPayload = jwt.decode(token)
    setLoading(true)
    const flow = (jwtPayload.roles.length > 0 && jwtPayload.roles.indexOf('PRE_MFA') >= 0) ? "mfaFlow" : "loginFlow"

    return callApi(`/authsrvc/auth/${flow}`, 'POST', body, token)
      .then(async e => { setLoading(false)
        if (e.success) decideToken(props, e.data.token, e.data.refreshToken)
      })
      .then(() => setLoading(false))
      .catch(() => setLoading(false))
  }

  React.useEffect(() => { downloadQuestions() }, [])

  const setForm = e => _setForm({ ...form, ...e })

  const setQuestion = (question, index) => {
    const newSqr = [...sqr]
    newSqr[index] = { ...newSqr[index], questionId: question }
    setSqr(newSqr)
    setDisabledQ(false)

  }

  const setAnswer = (answer, index) => {
    const newSqr = [...sqr]
    newSqr[index] = { ...newSqr[index], answer }
    setSqr(newSqr)

    answer.length > 0 ? setDisabledA(false) : setDisabledA(true)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1, maxHeight: '80vh' }}>
      <Grid container spacing={3} style={{ flex: 1, overflowY: 'auto' }}>
        <Grid item xs={12}>
          <h2 style={{ margin: 0 }}>Secret Questions</h2>
        </Grid>
        <Grid item xs={12}>
          {
            questionsLen.map((data, index) => (
              <div key={index}>
                {data.type === null ? (
                  <div>
                    <div>
                      <AppSelectInput
                        disabledList={sqr.map(s => s.questionId)}
                        value={sqr[index] && sqr[index].questionId}
                        onChange={e => setQuestion(e.target.value, index)}
                        label={`Question ${index + 1}`}
                        labels={questions.map(q => q.question)}
                        options={questions.map(q => q.id)}
                        style={{ width: 350 }}
                      />
                      <AppTextInput
                        value={data.type === null && sqr[index] ? sqr[index].answer : ''}
                        onChange={e => setAnswer(e.target.value, index)}
                        placeholder={`Answer ${index + 1}`}
                        // placeholder="..."
                        style={{ width: 350 }}
                      />
                    </div>
                    <div style={{ marginTop: 15, marginRight: 10, }}>
                      <Button
                        variant="contained"
                        style={{ float: 'right' }}
                        color="primary" onClick={() => onSave(index)}
                        disabled={(sqr[index] || {}).answer === '' || !(sqr[index] || {}).answer}>
                        Save Answer
                      </Button>
                    </div>
                  </div>
                ) : (
                    <div style={{ marginBottom: 10, marginTop: 10 }}>
                      <TextField
                        value={questions.filter(q => q.id === sqr[index].questionId).map(q => q.question)}
                        style={{ width: 350 }}
                        className={classes.textField}
                        fullWidth variant="outlined"
                        InputProps={{
                          className: classes.input,
                          endAdornment: (
                            <InputAdornment position="end" onClick={() => onEditClick(index)} >
                              <img src={Edit} style={{ cursor: 'pointer' }} />
                            </InputAdornment>
                          )
                        }}
                      />
                    </div>
                  )}
              </div>
            ))
          }
        </Grid>

        <Grid item xs={12} style={{ paddingTop: 0 }}>
          {questionsLen.length === maxQuestions ? (
            <Button
              variant="contained"
              style={{ float: 'right', marginRight: 10 }}
              color="primary" onClick={submitAnswers}
              disabled={isLoading || questionsLen.filter(q => q.type === 'editable').length !== maxQuestions}>{!isLoading ? 'Continue' : 'Loading...'}</Button>
          ) : (<></>)}
        </Grid>
      </Grid>
    </div>
  )
}