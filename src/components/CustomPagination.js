import React, { useEffect, useState } from "react";
import { Pagination, PaginationItem } from "@material-ui/lab";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { Menu, MenuItem } from "@material-ui/core";
// const PagingIcon=({type})=>{

//     switch (type) {
//         case "first":
//             return

//             break;
//         case "previous":

//             break;
//         case "next":

//             break;
//         case "last":

//             break;

//         default:
//             return null
//             break;
//     }

// }

function CustomPagination({
  rowsPerPageOption = [10, 25, 50, 100],
  rowsPerPage = false,
  onChangeRowsPerPage = () => {},
  count = false,
  data = [],
  page = 1,
  setChunk = () => {},
  onChangePage = () => {},
  totalCount=0,
  ...props
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selected, setSelected] = useState(
    rowsPerPage ? rowsPerPage : rowsPerPageOption[0]
  );
  const [currentPage, setCurrentPage] = useState(page===0?1:page);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (e) => {
    setAnchorEl(null);
  };
  let start = 0;
  let end = selected;
  if (currentPage !== 1) {
    // console.log("current page ",currentPage)
    start = (currentPage - 1) * selected;
    end = currentPage * selected;
  }
 
  useEffect(() => {
   
    if (data && data.length) {
    
      setChunk(data.slice(start, end));
    } else {
      setChunk([]);
    }
  }, [currentPage, data, selected]);

  let currentCount =
    data && data.length ? Math.ceil(data.length / selected) : count;

    let allCount=data.length|| totalCount;
  return (
    <div style={{display:'flex', justifyContent:'space-between'}}>
    <div style={{ display: "flex", alignItems: "center" }}>
      <Pagination
        count={currentCount}
        size="small"
        color="primary"
        showFirstButton
        showLastButton
        onChange={(event, newPage) => {
          onChangePage(event, newPage - 1);
          setCurrentPage(newPage);
        }}
        {...props}
      />
      <div
        onClick={handleClick}
        style={{
          marginLeft: "1rem",
          backgroundColor: "#363793",
          padding: "3px 2px 3px 9px",
          fontSize: "14px",
          borderRadius: "1rem",
          color: "#fff",
        }}
      >
        <span>{selected}</span>
        <ArrowDropDownIcon />
      </div>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {rowsPerPageOption.map((v) => (
          <MenuItem
            onClick={() => {
              handleClose();
              setSelected(v);
              onChangeRowsPerPage(v);
            }}
          >
            {v}
          </MenuItem>
        ))}
      </Menu>
    </div>
    <div style={{color:'grey'}}>{`Displaying ${allCount?start+1:0}-${end<allCount?end:allCount} of ${allCount} records`}</div>
    </div>
  );
}

// const slice = (start, end, data) => {
//   let arr = [];
//   if (start < data.length) {
//     let till = end < data.length ? end : data.length;
//     for (let index = start; index < till; index++) {
//       arr.push(data[index]);
//     }
//   }
//   console.log(arr);
//   return arr;
// };

export default CustomPagination;
