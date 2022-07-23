'use strict';

import React from 'react';
import { getFormatedDate } from '../../../utils/helper';
import ReportGrid from './ReportGrid'


const mappings =             {
    "displayName": "displayName",
    "created": "created",
    // "terminated": "updated",
    "status": "status",
    "roles": "provisionedApps.CYMMETRI.assignedRoles",
    "LastDate": "end_date"
}

let body = {
    "json": {
        "collection": "user",
        "dimensions": [
            {
                "displayName": "displayName",
                "created": "created",
                // "terminated": "updated",
                "status": "status",
                "roles": "provisionedApps.CYMMETRI.assignedRoles",
                "LastDate": "end_date"
            }
        ],
        "filters": {
            "and": [
                {
                    "userType": "Employee"
                }
            ]
        }
    }
}

const defaultFilters = {
    "and": [
        {
            "userType": "Employee"
        }
    ]
}


export default function EmployeesEndDate(props) {

    const getNextDate = () => {
        var date = new Date(); // Now
        date.setDate(date.getDate() + 30); // Set now + 30 days as the new date
        return getFormatedDate(date)
    }

    const datetimeFilters = {
        "and": [
          {
            "field": "end_date",
            "type": "date",
            "operator": "gte",
            "value": getFormatedDate(new Date())
          },
          {
            "field": "end_date",
            "type": "date",
            "operator": "lt",
            "value": getNextDate()
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
            }
        },
        {
            field: 'LastDate',
            filter: 'agDateColumnFilter',
            filterParams: filterDateParams,
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
            cellRenderer: (data) => {
                return data.data && getFormatedDate(data.data.LastDate, 'DD/MM/YYYY HH:mm')
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
                title="Employee's with upcoming contract end date"
                description="List of employees having contract end date in the next 30 days"
                mappings={mappings}
                body={body}
                columnDefs={columnDefs}
                defaultFilters={defaultFilters}
                defaultDatetimeFilters={datetimeFilters}
            />
        </>
    )
}

