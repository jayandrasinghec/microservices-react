import React from 'react'
import '../../../../../FrontendDesigns/new/assets/css/main.css';
import '../../../../../FrontendDesigns/new/assets/css/nice-select.css';
import '../../../../../FrontendDesigns/new/assets/css/settings.css';
import Admin from '../../../../../FrontendDesigns/new/assets/img/admin.png';
import { callApi } from '../../../../../utils/api';
import { showSuccess } from '../../../../../utils/notifications';
import LetterAvatar from '../../../../../components/LetterAvatar';
import SearchField from '../../../../../components/AppSearchField'
import EmptyScreen from '../../../../../components/EmptyScreen'

import '../../../../../FrontendDesigns/new/assets/css/users.css'
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 10,
    width: '60%',
    overflow: 'auto'
  },
  letteravatar: {
    height: 50,
    width: 50
  }
}))
const defaultQuery = {
  direction: "ASC",
  pageNumber: 0,
  pageSize: 5,
  sort: "FIRST_NAME",
  keyword: ""
}

function AddNew(props) {
  const [query, _setQuery] = React.useState(defaultQuery)
  const [users, setUsers] = React.useState([])
  const classes = useStyles()
  const download = () => {
    callApi(`/usersrvc/api/user/directory/list`, 'POST', query)
      .then(e => {
        if (e.success) {

          setUsers(e.data ? e.data.elements : [])
        }
      })
    }

  React.useEffect(() => download(), [query])

  const setSearchQuery = e => {
    _setQuery({ ...query, keyword: e, pageSize: 5 });
  }

  return (
    <div classNameName="AddNew">
      <div className="cym-app">
        <div className="add-admin-view pt-4 w-100">
          <h1 className="text-center mb-3">Add New Admin</h1>
          <div className="add-admin-roles w-75 m-auto">
            <SearchField
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by Name and Email" />

            <div className={classes.container}>
              {users.length === 0 ? (<EmptyScreen/>) : (<></>)}
              {query.keyword && users.map(user => {
                return(
                  <div onClick={() => props.history.push(`/dash/admin/admins/add/${user.id}`)} className="user-table-card-admin d-flex flex-sm-column flex-column flex-lg-row flex-md-column align-items-center">
                    <div className="col-12 col-sm-12 col-md-12 col-lg-12">
                      <div className="d-flex  flex-row align-items-center">
                        <div className="d-flex flex-row align-items-center" onClick={props.onClick}>
                          <div className="user-avatar">
                            <LetterAvatar text={`${user.firstName} ${user.lastName}`} profileImage={user.profilePic} status={user.status} className={classes.letteravatar} variant="dot"s/>
                          </div>
                          <div className="user-card-detail pl-2">
                            <h5>{user.firstName} {user.lastName}</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AddNew