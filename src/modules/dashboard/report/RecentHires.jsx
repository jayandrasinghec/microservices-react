'use strict';

import React from 'react';
import { getFormatedDate } from '../../../utils/helper';
import ReportGrid from './ReportGrid'


const mappings = {
    "displayName": "displayName",
    "created": "created",
    "terminated": "updated",
    "status": "status",
    "roles": "provisionedApps.CYMMETRI.assignedRoles",
    "start_date": "start_date",
    "end_date": "end_date"
}

let body = {
    "json": {
        "collection": "user",
        "dimensions": [
            {
                "displayName": "displayName",
                "created": "created",
                "terminated": "updated",
                "status": "status",
                "roles": "provisionedApps.CYMMETRI.assignedRoles",
                "start_date": "start_date",
                "end_date": "end_date"
            }
        ],
        "filters": {
            "and": [
                {
                    "status": "ACTIVE"
                }
            ]
        }
    }
}

const defaultFilters = {
    "and": [
        {
            "status": "ACTIVE"
        }
    ]
}


export default function RecentHires(props) {

    const getPrevDate = () => {
        var date = new Date(); // Now
        date.setDate(date.getDate() - 30); // Set now - 30 days as the new date
        return getFormatedDate(date)
    }

    const datetimeFilters = {
        "and": [
          {
            "field": "start_date",
            "type": "date",
            "operator": "gte",
            "value": getPrevDate()
          },
          {
            "field": "start_date",
            "type": "date",
            "operator": "lt",
            "value": getFormatedDate(new Date())
          }
        ],
        "or": []
    }

    const filterDateParams = {
        comparator: function (filterLocalDateAtMidnight, cellValue) {
            var dateAsString = cellValue;
            if (dateAsString == null) return -1;
                var dateParts = dateAsString.split('/');
                var cellDate = new Date(
                Number(dateParts[2]),
                Number(dateParts[1]) - 1,
                Number(dateParts[0])
            );
            if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
                return 0;
            }
            if (cellDate < filterLocalDateAtMidnight) {
                return -1;
            }
            if (cellDate > filterLocalDateAtMidnight) {
                return 1;
            }
        },
        buttons: ['reset'],
        browserDatePicker: true,
        minValidYear: 2000,
        filterOptions: ['equals', 'lessThan', 'lessThanOrEqual', 'greaterThan', 'greaterThanOrEqual', 'inRange'],
        defaultOption: 'inRange',
        suppressAndOrCondition: true
    };

    const columnDefs = [
        {
            field: 'displayName',
            filter: 'agTextColumnFilter',
        //   filterParams: { values: [] },
            filterParams: {
                filterOptions: ['equals'],
                defaultOption: 'equals',
                buttons: ['reset']
            },
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
        },
        {
            field: 'created',
            filter: 'agDateColumnFilter',
            filterParams: filterDateParams,
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
            cellRenderer: (data) => {
                return data.data && getFormatedDate(data.data.created, 'DD/MM/YYYY HH:mm')
                // return getFormatedDate(data.data.created, 'MM/DD/YYYY')
            }
        },
        {
            field: 'start_date',
            filter: 'agDateColumnFilter',
            filterParams: filterDateParams,
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
            cellRenderer: (data) => {
                return data.data && data.data.start_date && getFormatedDate(data.data.start_date, 'DD/MM/YYYY HH:mm')
                // return getFormatedDate(data.data.created, 'MM/DD/YYYY')
            }
        },
        {
            field: 'end_date',
            filter: 'agDateColumnFilter',
            filterParams: filterDateParams,
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
            cellRenderer: (data) => {
                return data.data && data.data.end_date && getFormatedDate(data.data.end_date, 'DD/MM/YYYY HH:mm')
                // return getFormatedDate(data.data.end_date, 'MM/DD/YYYY')
            }
        },
        {
            field: 'status',
            filter: 'agTextColumnFilter',
            filterParams: {
                filterOptions: ['equals'],
                defaultOption: 'equals',
                buttons: ['reset']
              },
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
        }
    ]


    return (
        <>
            <ReportGrid 
                profile={props.profile}
                title="Recent Hires"
                description="List of users having account start date in last 30 days."
                mappings={mappings}
                body={body}
                columnDefs={columnDefs}
                defaultFilters={defaultFilters}
                defaultDatetimeFilters={datetimeFilters}
            />
        </>
    )
}
    
    
    
