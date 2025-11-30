'use client';
import { useState } from 'react';
import {
  useUser,
  useFirestore,
  useCollection,
  useMemoFirebase,
  addDocumentNonBlocking,
  updateDocumentNonBlocking,
  deleteDocumentNonBlocking,
} from '@/firebase';
import {
  collection,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, FileWarning, ListTodo } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: any;
}

export default function TaskList() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const tasksCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, `userProfiles/${user.uid}/tasks`);
  }, [firestore, user]);

  const tasksQuery = useMemoFirebase(() => {
    if (!tasksCollectionRef) return null;
    return query(tasksCollectionRef, orderBy('createdAt', 'desc'));
  }, [tasksCollectionRef]);

  const {
    data: tasks,
    isLoading: areTasksLoading,
    error,
  } = useCollection<Omit<Task, 'id'>>(tasksQuery);

  const handleAddTask = () => {
    if (!tasksCollectionRef || !newTaskTitle.trim()) return;
    addDocumentNonBlocking(tasksCollectionRef, {
      title: newTaskTitle.trim(),
      completed: false,
      createdAt: serverTimestamp(),
    });
    setNewTaskTitle('');
  };

  const handleToggleTask = (task: Task) => {
    if (!firestore || !user) return;
    const taskDocRef = doc(firestore, `userProfiles/${user.uid}/tasks`, task.id);
    updateDocumentNonBlocking(taskDocRef, { completed: !task.completed });
  };

  const handleDeleteTask = (taskId: string) => {
    if (!firestore || !user) return;
    const taskDocRef = doc(firestore, `userProfiles/${user.uid}/tasks`, taskId);
    deleteDocumentNonBlocking(taskDocRef);
  };

  const renderLoadingState = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-5 flex-1" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
       <div className="flex items-center gap-4">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-5 flex-1" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
       <div className="flex items-center gap-4">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-5 flex-1" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/30 bg-muted/50 p-12 text-center">
        <div className="rounded-full bg-background p-3">
            <ListTodo className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No tasks yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
            Add a new task below to get started.
        </p>
    </div>
  );

  const renderErrorState = () => (
     <div className="flex flex-col items-center justify-center rounded-md border-2 border-destructive/50 bg-destructive/10 p-12 text-center text-destructive">
        <FileWarning className="h-8 w-8" />
        <h3 className="mt-4 text-lg font-semibold">Error Loading Tasks</h3>
        <p className="mt-1 text-sm ">
            There was a problem fetching your tasks. This could be due to a network issue or a permissions problem.
        </p>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Add a new task..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
          disabled={!user}
        />
        <Button onClick={handleAddTask} disabled={!user || !newTaskTitle.trim()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <div className="space-y-4">
        {(isUserLoading || areTasksLoading) && renderLoadingState()}
        {!isUserLoading && !areTasksLoading && error && renderErrorState()}
        {!isUserLoading && !areTasksLoading && !error && tasks && tasks.length === 0 && renderEmptyState()}
        {!isUserLoading && !areTasksLoading && !error && tasks && tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-4 rounded-md border p-3"
          >
            <Checkbox
              id={`task-${task.id}`}
              checked={task.completed}
              onCheckedChange={() => handleToggleTask(task)}
            />
            <label
              htmlFor={`task-${task.id}`}
              className={`flex-1 text-sm font-medium ${
                task.completed ? 'text-muted-foreground line-through' : ''
              }`}
            >
              {task.title}
            </label>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => handleDeleteTask(task.id)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete task</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
