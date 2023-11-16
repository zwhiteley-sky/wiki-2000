import { Outlet } from "react-router-dom";

/**
 * The root component.
 */
export default function Root() {
    return (
        <>
            <h1>Wiki 2000</h1>
            <Outlet />
        </>
    )
}