"use client"

import { DemoRoleSwitch, PageShell, ThemeToggle } from "@/widgets/app-shell"
import { useAuth } from "@/features/auth"
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ppt/luminis"

export function SettingsPage() {
    const { user, isApiMode, logout } = useAuth()

    return (
        <PageShell
            title="Settings"
            description="Appearance and, in demo mode, which role you are viewing as."
        >
            <Card>
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Dark mode is saved on this device.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground">Dark mode</p>
                            <p className="text-xs text-muted-foreground">
                                Switch between light and dark.
                            </p>
                        </div>
                        <ThemeToggle />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Role</CardTitle>
                    <CardDescription>
                        {isApiMode
                            ? "Your role comes from the signed-in account."
                            : "Demo mode — pick Team or HR Admin to see each view."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm text-muted-foreground">Current</span>
                        <Badge variant={user?.isAdmin ? "secondary" : "outline"}>
                            {user?.isAdmin ? "HR Admin" : "Team"}
                        </Badge>
                    </div>
                    {!isApiMode ? <DemoRoleSwitch /> : null}
                    {isApiMode ? (
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={() => void logout()}
                        >
                            Sign out
                        </Button>
                    ) : null}
                </CardContent>
            </Card>
        </PageShell>
    )
}
