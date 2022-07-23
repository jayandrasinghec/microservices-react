import React from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { isActiveForRoles } from '../utils/auth'
import '../FrontendDesigns/master-screen-settings/assets/css/profile.css'


interface IProps {
  links: {
    href: string
    name: string
    roles?: string[]
    icon?: string
  }[]
}


export default function AppTabView(props: IProps) {
  const history = useHistory();
  let path = history.location.pathname
  return (
    <div className="cym-tab-view mb-3 mb-sm-3 mb-md-0">
      <ul className="nav nav-tabs" role="tablist">
        {
          props.links.map(link => {
            if (link.roles && link.roles.length > 0) {
              if (!isActiveForRoles(link.roles)) return
            }
            if(path === link.href){
              return  <li key={link.href} className="nav-item" role="presentation">
              <NavLink to={link.href} onClick={(e)=>{e.preventDefault();}} className="nav-link" activeClassName="nav-link active">
                {link.icon}{link.name}
              </NavLink>
            </li>
            }
            return (
              <li key={link.href} className="nav-item" role="presentation">
                <NavLink to={link.href} className="nav-link" activeClassName="nav-link active">
                  {link.icon}{link.name}
                </NavLink>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}