import React from 'react';
import ReactDOMServer from 'react-dom/server';


export default function render(text) {
    return ReactDOMServer.renderToString(

        <div>{text}</div>

    )
}


