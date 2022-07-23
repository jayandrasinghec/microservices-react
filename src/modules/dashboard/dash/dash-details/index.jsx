import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import GoogleLogo from '../../../../assets/googleLogo.png'
import AddApp from '../../../../assets/AddApp.svg'
import AssignApp from '../../../../assets/AssignApp.svg'
import AddUser from '../../../../assets/AddUser.svg'
import ActivateUser from '../../../../assets/ActivateUser.svg'
import DeactivateUser from '../../../../assets/DeactivateUser.svg'
import ResetPassword from '../../../../assets/ResetPassword.svg'
import UnlockUser from '../../../../assets/UnlockUser.svg'
import HealthInsights from '../../../../assets/HealthInsights.svg'
import WebSessions from '../../../../assets/WebSessions.svg'
import MenuItem from '@material-ui/core/MenuItem'
import DropDown from '../../../../components/DropDownComponent'
import ReactEcharts from 'echarts-for-react'
import { withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import OEMChart from './OEMChart'
import AuthChart from './AuthChart'
import MostSigninApp from './MostSigninApp'
import Counter from './Counter'
import Accounts from './Accounts'
import { getAuthToken } from '../../../../utils/auth';
import { useHistory } from 'react-router-dom'


// const PrettoSlider = withStyles({
//     root: {
//       color: '#42E0FC',
//       height: 8,
//     },
//     thumb: {
//       height: 24,
//       width: 24,
//       backgroundColor: '#fff',
//       border: '2px solid currentColor',
//       marginTop: -8,
//       marginLeft: -12,
//       '&:focus, &:hover, &$active': {
//         boxShadow: 'inherit',
//       },
//     },
//     active: {},
//     valueLabel: {
//       left: 'calc(-50% + 4px)',
//     },
//     track: {
//       height: 8,
//       color: '#42E0FC',
//       width: '8px !important' ,
//       borderRadius: 4,
//     },
//     rail: {
//       height: 8,
//       color: '#EFF2F7',
//       width: '8px !important' ,
//       borderRadius: 4,
//     },
//   })(Slider);

//   const HoriOneSlider = withStyles({
//     root: {
//       color: '#42E0FC',
//       height: 8,
//     },
//     thumb: {
//       height: 24,
//       width: 24,
//       backgroundColor: '#fff',
//       border: '2px solid currentColor',
//       marginTop: -8,
//       marginLeft: -12,
//       '&:focus, &:hover, &$active': {
//         boxShadow: 'inherit',
//       },
//     },
//     active: {},
//     valueLabel: {
//       left: 'calc(-50% + 4px)',
//     },
//     track: {
//       height: 8,
//       color: '#42E0FC',
//       borderRadius: 4,
//     },
//     rail: {
//       height: 8,
//       color: '#EFF2F7',
//       borderRadius: 4,
//     },
//   })(Slider);

//   const HoriTwoSlider = withStyles({
//     root: {
//       color: '#FF8F00',
//       height: 8,
//     },
//     thumb: {
//       height: 24,
//       width: 24,
//       backgroundColor: '#fff',
//       border: '2px solid currentColor',
//       marginTop: -8,
//       marginLeft: -12,
//       '&:focus, &:hover, &$active': {
//         boxShadow: 'inherit',
//       },
//     },
//     active: {},
//     valueLabel: {
//       left: 'calc(-50% + 4px)',
//     },
//     track: {
//       height: 8,
//       color: '#FF8F00',
//       borderRadius: 4,
//     },
//     rail: {
//       height: 8,
//       color: '#EFF2F7',
//       borderRadius: 4,
//     },
//   })(Slider);

//   const HoriThreeSlider = withStyles({
//     root: {
//       color: '#FFCC41',
//       height: 8,
//     },
//     thumb: {
//       height: 24,
//       width: 24,
//       backgroundColor: '#fff',
//       border: '2px solid currentColor',
//       marginTop: -8,
//       marginLeft: -12,
//       '&:focus, &:hover, &$active': {
//         boxShadow: 'inherit',
//       },
//     },
//     active: {},
//     valueLabel: {
//       left: 'calc(-50% + 4px)',
//     },
//     track: {
//       height: 8,
//       color: '#FFCC41',
//       borderRadius: 4,
//     },
//     rail: {
//       height: 8,
//       color: '#EFF2F7',
//       borderRadius: 4,
//     },
//   })(Slider);
//     const drop = [
//     {type: 'Active'}, {type: 'Deactive'}, {type: 'Last 90 Days'},
//   ]
//   var colors = ['#EF3B39', '#6DC497'];
//   const option = {
//     color: colors,

//     tooltip: {
//         trigger: 'none',
//         axisPointer: {
//             type: 'cross'
//         }
//     },
//     legend: {
//         data:['Locked', 'Not Logged In']
//     },
//     grid: {
//         top: 70,
//         bottom: 50
//     },
//     xAxis: [
//         {
//             type: 'category',
//             axisTick: {
//                 alignWithLabel: true
//             },
//             axisLine: {
//                 onZero: false,
//                 lineStyle: {
//                     color: '#8998AC'
//                 }
//             },
//             axisPointer: {
//                 label: {
//                     formatter: function (params) {
//                         return  params.value
//                             + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
//                     }
//                 }
//             },
//             data: ['Jul, 20','Aug, 20','Sep, 20','Oct, 20']
//         },
//         {
//             type: 'category',
//             axisTick: {
//                 alignWithLabel: true
//             },
//             // axisLine: {
//             //     onZero: false,
//             //     lineStyle: {
//             //         color: colors[0]
//             //     }
//             // },
//             axisPointer: {
//                 label: {
//                     formatter: function (params) {
//                         return params.value
//                             + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
//                     }
//                 }
//             },
//             // data: ['Jul, 20','Aug, 20','Sep, 20','Oct, 20']
//         }
//     ],
//     yAxis: [
//         {
//             type: 'value'
//         }
//     ],
//     series: [
//         {
//             name: 'Locked ',
//             type: 'line',
//             xAxisIndex: 1,
//             smooth: true,
//             data: [2200,900,1900,1300]
//         },
//         {
//             name: 'Not Logged In ',
//             type: 'line',
//             smooth: true,
//             data: [2000,1000,1800,1000]
//         }
//     ]
// };

// const authenticationoption = {
//     color: colors,
//     tooltip: {
//         trigger: 'item',
//         formatter: '{a} <br/>{b}: {c} ({d}%)'
//     },
//     legend: {
//         orient: 'horizontal',
//         // left: 10,
//         borderRadius:'100px',
//         data: ['Sucess','Failure'],
//     },
//     series: [
//         {
//             name: 'Authentication',
//             type: 'pie',
//             radius: ['50%', '70%'],
//             avoidLabelOverlap: false,
//             label: {
//                 show: false,
//                 position: 'center'
//             },
//             emphasis: {
//                 label: {
//                     show: true,
//                     fontSize: '25',
//                     fontWeight: 'bold'
//                 }
//             },
//             labelLine: {
//                 show: false
//             },
//             data: [
                
//                 {value: 834, name: 'Failure'},
//                 {value: 5028, name: 'Sucess'},
//             ]
//         }
//     ]
// };

  
const useStyles = makeStyles(() => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
    },
    rowone: {
        display: 'flex',
        flexDirection:'row',
        padding: '20px',
        width:'100%',
        justifyContent: 'space-between',
    },
    useropinfo: {
        backgroundColor: 'white',
        borderRadius:'8px',
        margin: '10px 20px 10px 0',
        padding: '20px',
        width:'31%',
    },
    headone: {
        fontSize: '14px',
        marginBottom: '0px',
    },
    accinfo: {
        backgroundColor: 'white',
        borderRadius:'8px',
        margin: '10px 20px 10px 10px',
        padding: '20px',
        width: 'fit-content'
    },
    lastinfo: {      
        margin: '10px 0 10px 10px',
        display: 'flex',
        flexDirection: 'column',
        width:'31%',
    },
    activeinfoone: {
        display: 'flex',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    activeinfotwo: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: 'auto',
        alignSelf: 'flex-end',
        marginRight: '15px',
    },
    auth: {
        backgroundColor: 'white',
        borderRadius:'8px',
        marginBottom: '10px',
        padding: '20px',
    },
    activeinfo: {
        backgroundColor: 'white',
        borderRadius:'8px',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        // justifyContent: 'center',
    },
    rowOneLeft: {
        backgroundColor: 'white',
        borderRadius:'8px',
        margin: '10px 20px 10px 0',
        padding: '20px',
        width:'50%',
    },
    rowOneRight: {
        backgroundColor: 'white',
        borderRadius:'8px',
        margin: '10px 20px 10px 0',
        // marginBottom: '10px',
        padding: '20px',
        width:'50%',
    },
    rowtwo: {
        padding: '0 20px',
    },
    options:{
        backgroundColor: 'white',
        borderRadius:'8px',
        // margin: '0 10px 10px 0',
        padding: '20px',
        width: '100%',
        display: 'flex',
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    rowthree: {
        display: 'flex',
        flexDirection:'row',
        padding: '20px 10px ',
    },
    appinfo: {
        backgroundColor: 'white',
        borderRadius:'8px',
        margin: '10px 20px 10px 10px',
        padding: '20px',
        width: '30%'
    },
    accchartinfo: {
        backgroundColor: 'white',
        borderRadius:'8px',
        margin: '10px',
        padding: '20px',
        flexGrow: 1 ,
        display: 'flex',
        flexDirection: 'column',
    },
    img: {
        width: '50px',
        height: '50px',
        margin: '0 10px 10px 10px'
    },
    imgdiv: {
        margin: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: '14px',
        color: '#8392A7',
        cursor: 'pointer',
    },
    headthree: {
        fontSize: '28px',
        color: 'black',
        // marginBottom: '0px',
    },
    headthreetwo: {
        fontSize: '24px',
        color: 'black',
        // marginRight: '10px',
        marginBottom: '0px',
    },
    imgone: {
        width: '28px',
        height: '28px',
        marginRight: '20px', 
    },
}))

export default function DashDetails(props)
{
    const classes = useStyles();
    const history = useHistory();
    const token = getAuthToken()
    
    return(
        <div className={classes.container}>
            <div className={classes.rowone}>
                {/* <div className={classes.useropinfo}>
                    <h3 className={classes.headone}>OEM User Operations</h3>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems:'center', marginTop:'60px', justifyContent: 'space-evenly'}}>
                        <div>
                            <PrettoSlider valueLabelDisplay="auto" style={{height: '300px',alignSelf:'center', margin:'auto'}} orientation="vertical" aria-label="pretto slider" defaultValue={40} />
                            <Typography style={{color:'#8998AC',fontSize:'12px', fontStyle:'normal', marginTop:'10px'}} gutterBottom>Created</Typography>
                        </div>
                        <div>
                            <PrettoSlider valueLabelDisplay="auto" style={{height: '300px',alignSelf:'center', margin:'auto'}} orientation="vertical" aria-label="pretto slider" defaultValue={40} />
                            <Typography style={{color:'#8998AC',fontSize:'12px', fontStyle:'normal', marginTop:'10px'}} gutterBottom>Disabled</Typography>
                        </div>
                        <div>
                            <PrettoSlider valueLabelDisplay="auto" style={{height: '300px',alignSelf:'center', margin:'auto'}} orientation="vertical" aria-label="pretto slider" defaultValue={40} />
                            <Typography style={{color:'#8998AC',fontSize:'12px', fontStyle:'normal', marginTop:'10px'}} gutterBottom>Deleted</Typography>
                        </div>
                    </div>
                </div>
                <div className={classes.accinfo}>
                    <h3 className={classes.headone}>Accounts where password never expires</h3>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems:'center', justifyContent: 'space-evenly'}}>
                        <div>
                            <Typography style={{color:'#8998AC', fontSize:'12px', fontStyle:'normal', marginTop:'30px'}} gutterBottom>Tab protected-network local</Typography>
                            <Typography style={{color:'black', fontSize:'12px', fontStyle:'normal', marginBottom:'10px'}} gutterBottom>123</Typography>
                            <HoriOneSlider valueLabelDisplay="auto" style={{width: '300px',alignSelf:'center', margin:'auto'}} orientation="horizontal" aria-label="pretto slider" defaultValue={40} />
                            
                        </div>
                        <div>
                            <Typography style={{color:'#8998AC',fontSize:'12px', fontStyle:'normal', marginTop:'30px'}} gutterBottom>Protected-network local</Typography>
                            <Typography style={{color:'black',fontSize:'12px', fontStyle:'normal', marginBottom:'10px'}} gutterBottom>10</Typography>
                            <HoriTwoSlider valueLabelDisplay="auto" style={{width: '300px',alignSelf:'center', margin:'auto'}} orientation="horizontal" aria-label="pretto slider" defaultValue={10} />
                            
                        </div>
                        <div>
                            <Typography style={{color:'#8998AC', fontSize:'12px', fontStyle:'normal', marginTop:'30px'}} gutterBottom>Eng protected-network local</Typography>
                            <Typography style={{color:'black', fontSize:'12px', fontStyle:'normal', marginBottom:'10px'}} gutterBottom>231</Typography>
                            <HoriThreeSlider valueLabelDisplay="auto" style={{width: '300px',alignSelf:'center', margin:'auto'}} orientation="horizontal" aria-label="pretto slider" defaultValue={40} />
                            
                        </div>
                    </div>
                </div>
                <div className={classes.lastinfo}>
                    <div className={classes.auth}>
                        <h3 className={classes.headone}>Authentication</h3>
                        <ReactEcharts
                            // 
                            style={{marginTop: '15px'}}
                            option={authenticationoption}
                        />
                    </div>
                    <div className={classes.auth}>
                        <h3 className={classes.headone}>Authorization</h3>
                        <ReactEcharts
                            style={{marginTop: '15px'}}
                            option={authenticationoption}
                        />
                    </div>
                    <div className={classes.activeinfo}>
                        <div className={classes.activeinfoone}>
                            <img src={WebSessions} className={classes.imgone}></img>
                            <h3 className={classes.headone}>Active Web Sessions</h3>
                        </div>
                        <div className={classes.activeinfotwo}>
                            <h3 className={classes.headthreetwo}>24</h3>
                        </div>
                    </div>
                </div> */}
                <div className={classes.rowOneLeft} >
                    <h3 className={classes.headone + ' pb-2'}>User Operations</h3>
                    <OEMChart refreshInt={props.refreshInt} token={token} />
                </div>
                <div className={classes.rowOneRight}>
                    <h3 className={classes.headone + ' pb-2'}>Authentication</h3>
                    <AuthChart refreshInt={props.refreshInt} token={token} />
                </div>
            </div>
            <div className={classes.rowtwo}>
                <div className={classes.options}>
                    <div className={classes.imgdiv} onClick={() => history.push('/dash/apps/applications/add')}>
                        <img src={AddApp} className={classes.img} alt="addlogo"/>
                        <span>Add Applications</span>
                    </div>
                    <div className={classes.imgdiv} onClick={() => history.push('/dash/apps/applications')}>
                        <img src={AssignApp} className={classes.img} alt="addlogo"/>
                        <span>Assign Applications</span>
                    </div>
                    <div className={classes.imgdiv} onClick={() => history.push('/dash/directory/add/user')}>
                        <img src={AddUser} className={classes.img} alt="addlogo"/>
                        <span>Add User</span>
                    </div>
                    <div className={classes.imgdiv} onClick={() => history.push('/dash/directory/user')}>
                        <img src={ActivateUser} className={classes.img} alt="addlogo"/>
                        <span>Activate User</span>
                    </div>
                    <div className={classes.imgdiv} onClick={() => history.push('/dash/directory/user')}>
                        <img src={DeactivateUser} className={classes.img} alt="addlogo"/>
                        <span>Deactivate User</span>
                    </div>
                    <div className={classes.imgdiv} onClick={() => history.push('/dash/directory/user')}>
                        <img src={ResetPassword} className={classes.img} alt="addlogo"/>
                        <span>Reset Password</span>
                    </div>
                    <div className={classes.imgdiv} onClick={() => history.push('/dash/directory/user')}>
                        <img src={UnlockUser} className={classes.img} alt="addlogo"/>
                        <span>Unlock User</span>
                    </div>
                    {/* <div className={classes.imgdiv}>
                        <img src={HealthInsights} className={classes.img} alt="addlogo"/>
                        <span>Health Insights</span>
                    </div> */}
                </div>
            </div>
            <div className={classes.rowthree}>
                <div className={classes.appinfo}>
                    <div style={{display:'flex'}}>
                        <div className={classes.activeinfoone}>
                            <h3 className={classes.headone} style={{fontSize:'16px'}}>Apps with most sign-in</h3>
                        </div>
                        <div className={classes.activeinfotwo}>
                            {/* <p style={{color: '#8392A7',fontSize: '16px',marginLeft: '20px'}}>
                                Unique
                            </p> */}
                            <p style={{color: '#8392A7',fontSize: '16px',marginLeft: '20px'}}>
                                Total
                            </p>
                        </div>
                    </div>
                    {/* <div style={{display:'flex', color: '#8392A7',fontSize: '14px', marginTop: '20px'}}>
                        <div className={classes.activeinfoone}>
                            <img src={GoogleLogo} className={classes.imgone}></img>
                            <p style={{color: '#8392A7',fontSize: '14px', marginTop:'0px', marginBottom:'0px'}}>Google Suite</p>
                        </div>
                        <div className={classes.activeinfotwo}>
                            <p style={{color: '#8392A7',fontSize: '14px',marginRight: '15px', marginTop:'0px', marginBottom:'0px'}}>
                                210
                            </p>
                            <p style={{color: '#8392A7',fontSize: '14px',marginLeft: '20px', marginTop:'0px', marginBottom:'0px'}}>
                                5,508
                            </p>
                        </div>
                    </div>
                    <div style={{display:'flex', color: '#8392A7',fontSize: '14px', marginTop: '20px'}}>
                        <div className={classes.activeinfoone}>
                            <img src={GoogleLogo} className={classes.imgone}></img>
                            <p style={{color: '#8392A7',fontSize: '14px', marginTop:'0px', marginBottom:'0px'}}>Google Suite</p>
                        </div>
                        <div className={classes.activeinfotwo}>
                            <p style={{color: '#8392A7',fontSize: '14px',marginRight: '15px', marginTop:'0px', marginBottom:'0px'}}>
                                210
                            </p>
                            <p style={{color: '#8392A7',fontSize: '14px',marginLeft: '20px', marginTop:'0px', marginBottom:'0px'}}>
                                5,508
                            </p>
                        </div>
                    </div>
                    <div style={{display:'flex', color: '#8392A7',fontSize: '14px', marginTop: '20px'}}>
                        <div className={classes.activeinfoone}>
                            <img src={GoogleLogo} className={classes.imgone}></img>
                            <p style={{color: '#8392A7',fontSize: '14px', marginTop:'0px', marginBottom:'0px'}}>Google Suite</p>
                        </div>
                        <div className={classes.activeinfotwo}>
                            <p style={{color: '#8392A7',fontSize: '14px',marginRight: '15px', marginTop:'0px', marginBottom:'0px'}}>
                                210
                            </p>
                            <p style={{color: '#8392A7',fontSize: '14px',marginLeft: '20px', marginTop:'0px', marginBottom:'0px'}}>
                                5,508
                            </p>
                        </div>
                    </div>
                    <div style={{display:'flex', color: '#8392A7',fontSize: '14px', marginTop: '20px'}}>
                        <div className={classes.activeinfoone}>
                            <img src={GoogleLogo} className={classes.imgone}></img>
                            <p style={{color: '#8392A7',fontSize: '14px', marginTop:'0px', marginBottom:'0px'}}>Google Suite</p>
                        </div>
                        <div className={classes.activeinfotwo}>
                            <p style={{color: '#8392A7',fontSize: '14px',marginRight: '15px', marginTop:'0px', marginBottom:'0px'}}>
                                210
                            </p>
                            <p style={{color: '#8392A7',fontSize: '14px',marginLeft: '20px', marginTop:'0px', marginBottom:'0px'}}>
                                5,508
                            </p>
                        </div>
                    </div>
                    <div style={{display:'flex', color: '#8392A7',fontSize: '14px', marginTop: '20px'}}>
                        <div className={classes.activeinfoone}>
                            <img src={GoogleLogo} className={classes.imgone}></img>
                            <p style={{color: '#8392A7',fontSize: '14px', marginTop:'0px', marginBottom:'0px'}}>Google Suite</p>
                        </div>
                        <div className={classes.activeinfotwo}>
                            <p style={{color: '#8392A7',fontSize: '14px',marginRight: '15px', marginTop:'0px', marginBottom:'0px'}}>
                                210
                            </p>
                            <p style={{color: '#8392A7',fontSize: '14px',marginLeft: '20px', marginTop:'0px', marginBottom:'0px'}}>
                                5,508
                            </p>
                        </div>
                    </div>
                    <div style={{display:'flex', color: '#8392A7',fontSize: '14px', marginTop: '20px'}}>
                        <div className={classes.activeinfoone}>
                            <img src={GoogleLogo} className={classes.imgone}></img>
                            <p style={{color: '#8392A7',fontSize: '14px', marginTop:'0px', marginBottom:'0px'}}>Google Suite</p>
                        </div>
                        <div className={classes.activeinfotwo}>
                            <p style={{color: '#8392A7',fontSize: '14px',marginRight: '15px', marginTop:'0px', marginBottom:'0px'}}>
                                210
                            </p>
                            <p style={{color: '#8392A7',fontSize: '14px',marginLeft: '20px', marginTop:'0px', marginBottom:'0px'}}>
                                5,508
                            </p>
                        </div>
                    </div> */}
                    <MostSigninApp refreshInt={props.refreshInt} token={token}/>
                </div>
                <div className={classes.accchartinfo}>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <h3 className={classes.headone}>Accounts Locked</h3>
                        {/* <h3 className={classes.headone}>Accounts Locked & Not logged in</h3> */}
                        {/* <div style={{display: 'flex', alignSelf:'flex-end', justifySelf: 'self-end', margin:'auto',marginRight:'0px'}}>
                            <DropDown title="Last 90 Days" options={drop} body={
                                drop.map(o => {
                                return (
                                    <MenuItem key={o.type}>
                                    <div className={classes.displayflex}>
                                        <span className={classes.span}>{o.type}</span>
                                    </div>
                                    </MenuItem>
                                )
                                })
                            } />
                        </div> */}
                    </div>
                    <div style={{width: "100%", padding: "0px"}}>
                    {/* <ReactEcharts
                        // option={{
                        // xAxis: {
                        //     type: 'category',
                        //     data: ['May, 20','Jun, 20','July, 20',"Aug,20"]
                        // },
                        // yAxis: {
                        //     type: 'value'
                        // },
                        // series: [{ 
                        //     data: [600,800,650,1000],
                        //     type: 'line'
                        // }]
                        // }}
                        option={option}
                    /> */}
                    <Accounts refreshInt={props.refreshInt} token={token} />
                    </div>
                    
                </div>
            </div>
            <div className={classes.rowtwo}>
                <div className={classes.options}>
                    <Counter refreshInt={props.refreshInt} token={token} />
                    {/* <MostSigninApp /> */}
                </div>
            </div>
        </div>
    )
}