'use strict';

import React from 'react';
import { getFormatedDate } from '../../../utils/helper';
import ReportGrid from './ReportGrid'

const mappings = {
    "displayName": "displayName",
    "created": "created",
    "status": "status",
    "roles": "provisionedApps.CYMMETRI.assignedRoles"
}

let body = {
    "json": {
        "collection": "user",
        "dimensions": [
            {
                "displayName": "displayName",
                "created": "created",
                "status": "status",
                "roles": "provisionedApps.CYMMETRI.assignedRoles"
            }
        ],
        "filters": {
            "and": [
                {
                    "provisionedApps.CYMMETRI.assignedRoles": "DOMAIN_ADMIN"
                }
            ]
        }
    }
}

const defaultFilters = {
    "and": [
        {
            "provisionedApps.CYMMETRI.assignedRoles": "DOMAIN_ADMIN"
        }
    ]
}


export default function DomainAdminAccess(props) {

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
                title="Domain Admin Access"
                description={"All users having Domain admin access."}
                mappings={mappings}
                body={body}
                columnDefs={columnDefs}
                defaultFilters={defaultFilters}
            />
        </>
    )
}
    
    
    
