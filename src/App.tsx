import "./index.css"

import { routes } from "@/configs/route"
import { AppShellLayout } from "@/layout/AppShellLayout"
import { Route, Routes } from "react-router-dom"

function App() {
    return (
        <Routes>
            <Route path="/" element={<AppShellLayout />}>
                {Object.values(routes).map((route) => (
                    <Route
                        key={route.path}
                        {...(route.path === "/"
                            ? { index: true }
                            : { path: route.path.slice(1) })}
                        element={<route.element />}
                    />
                ))}
            </Route>
        </Routes>
    )
}

export default App
