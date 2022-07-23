import React from 'react'
import { callMasterApi } from '../../../../utils/api'
import * as ProvSrvc from '../../../../api/provsrvc'
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  wrapper: { margin: '0px' },
  container: { width: '100%', display: 'flex' },
  card: { padding: 30, background: '#EFF3F9', borderRadius: '5px', display: 'inline-block', height: '100%', margin: '0 1rem', position: 'relative', flex: 1 },
  firstth:{ textAlign: 'left', height: '40px', width: '100%', fontStyle: 'normal', color: '#1F4287' },
  secondth:{ width: '50%', textAlign: 'right', fontStyle: 'normal', fontWeight: 'bold', color: '#8392A7', },
  thirdth:{ textAlign: 'left', height: '40px', width: '100%', fontStyle: 'normal', color: '#1F4287' },
  fourthth:{ width: '50%', textAlign: 'right', fontStyle: 'normal', fontWeight: 'normal', color: '#8392A7', }

}))

export default function AppTags(props) {
  // const classes = useStyles()
  const [categories, setCategories] = React.useState([])
  const classes = useStyles()
  React.useEffect(() => {
    ProvSrvc.getCategoryTag()
      .then(e => { if (e.success) { setCategories(e.data ? e.data : []) } })
  }, [])

  return (
    <div className="wrapper" className={classes.wrapper}>
      <div className="main_container" className={classes.container}>
        <div className="card card-1" className={classes.card}>
          <table>
            <tbody>
              <tr  onClick={() => props.onClick(null)}>
                <th style={{fontWeight: (props.currentTag ? 'normal' : 'bold')}} className={classes.firstth}>All Applications</th>
                <th className={classes.secondth}> {props.totalApps} </th>
              </tr>

              {categories.map((u, key) => {
                const active = props.currentTag === u.tag
                return (
                  <tr key={key} onClick={() => props.onClick(u.tag)}>
                    <th style={{fontWeight: active ? 'bold' : 'normal'}} className={classes.thirdth}> {u.tag} </th>
                    <th className={classes.fourthth}> {u.total} </th>
                  </tr>
                )
              })}
            </tbody></table>
        </div>
      </div>
    </div>
  )
}