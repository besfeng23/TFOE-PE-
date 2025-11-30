import TaskList from "@/components/tasks/task-list";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TasksPage() {
  return (
    <div className="grid gap-6">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">My Tasks</CardTitle>
                <CardDescription>
                    Manage your to-do list and action items.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <TaskList />
            </CardContent>
        </Card>
    </div>
  )
}

    