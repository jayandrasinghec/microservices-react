import {Button, Tab, Tabs } from '@material-ui/core'
import React from 'react'
import ApplicationsCard from './ApplicationsCard'
import NotificationCard from './NotificationCard'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import RecentActivityCard from './RecentActivityCard'
import "./styles.css"


export default function SideBarView() {

return (
      <div className="container_box">
         <div className="row tab-bar" >
            <Tabs value={0} TabIndicatorProps={{ style: { background: '#173F74' } }} aria-label="simple tabs example">
               <Tab label="Policies" style={{color:"#173F74"}} />
               <Tab label="Session" style={{color:"#8E8E8E"}}/>
               <Tab label="Analytics" style={{color:"#8E8E8E"}}/>
            </Tabs>
            {/* <div className="selected_user">Default OU</div> */}
         </div>

         <div>
            <RecentActivityCard />
         </div>

         <div> <ApplicationsCard /></div>

         <div>
            <NotificationCard />
         </div>
         <div className="row button_row justify-content-end pt-5">
            <Button className="custom_button"
               style={{ textTransform: "capitalize", backgroundColor: "#173F74", color: "white", borderRadius: "10px" }}
               variant="contained"

            >
               Assign <span className="bttn_more"><ExpandMoreIcon /></span>
            </Button>

         </div>

      </div>
   )

}


