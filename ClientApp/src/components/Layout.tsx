import * as React from 'react';
import NavMenu from './NavMenu';
import "./Layout.css";

export default (props: { children?: React.ReactNode }) => (
    <React.Fragment>
        <NavMenu/>
        <main className="container">
            {props.children}
        </main>
    </React.Fragment>
);
