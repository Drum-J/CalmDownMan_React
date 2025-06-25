import Header from './Header.js';
import {WithChildren} from "../common/WithChildren.ts";

export default function Layout({ children } : WithChildren) {
    return (
        <>
            <Header />
            <main>{children}</main>
        </>
    );
}