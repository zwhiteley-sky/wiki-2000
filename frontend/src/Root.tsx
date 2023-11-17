import { Outlet } from "react-router-dom";

/**
 * The root component.
 */
export default function Root() {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column"
        }}>
            <h1 style={{ position: "sticky" }}>Wiki 2000</h1>
            <div style={{ flexGrow: "1" }}>
                <Outlet />
            </div>
        </div>
    )
}