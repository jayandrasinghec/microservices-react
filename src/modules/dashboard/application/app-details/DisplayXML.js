import React from 'react';

export default function DisplayXML() {

    return (
        <textarea cols="40" style={{border:"none", width:"100%", height:"100%"}}>
            {localStorage.getItem('xmlData')}
        </textarea>
    )
}
