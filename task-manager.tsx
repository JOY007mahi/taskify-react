"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus } from "lucide-react"

interface Task {
  id: number
  title: string
  completed: boolean
}

type FilterType = "all" | "active" | "completed"

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [filter, setFilter] = useState<FilterType>("all")

  // Load from localStorage on first render
  useEffect(() => {
    const stored = localStorage.getItem("tasks")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setTasks(parsed)
        }
      } catch (err) {
        console.error("Error loading tasks:", err)
      }
    }
  }, [])

  // Save to localStorage on every task change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  const addTask = () => {
    if (newTaskTitle.trim() !== "") {
      const newTask: Task = {
        id: Date.now(),
        title: newTaskTitle.trim(),
        completed: false,
      }
      setTasks([...tasks, newTask])
      setNewTaskTitle("")
    }
  }

  const toggleTask = (id: number) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const clearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed))
  }

  const filteredTasks = tasks.filter((task) => {
    switch (filter) {
      case "active":
        return !task.completed
      case "completed":
        return task.completed
      default:
        return true
    }
  })

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.completed).length
  const activeTasks = totalTasks - completedTasks

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Task Manager</CardTitle>
          <div className="flex justify-center gap-4 text-sm text-muted-foreground">
            <span>Total: {totalTasks}</span>
            <span>Active: {activeTasks}</span>
            <span>Completed: {completedTasks}</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Add Task */}
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter a new task..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addTask()
              }}
              className="flex-1"
            />
            <Button onClick={addTask} disabled={!newTaskTitle.trim()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>

          {/* Filter + Clear Completed */}
          <div className="flex flex-wrap justify-center gap-2">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
              All ({totalTasks})
            </Button>
            <Button variant={filter === "active" ? "default" : "outline"} size="sm" onClick={() => setFilter("active")}>
              Active ({activeTasks})
            </Button>
            <Button
              variant={filter === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("completed")}
            >
              Completed ({completedTasks})
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={clearCompleted}
              disabled={completedTasks === 0}
            >
              Clear Completed
            </Button>
          </div>

          {/* Task List */}
          <div className="space-y-2">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {filter === "all" ? "No tasks yet. Add one above!" : `No ${filter} tasks.`}
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center gap-3 p-3 border rounded-lg transition-all hover:shadow-sm ${
                    task.completed ? "bg-muted/50" : "bg-background"
                  }`}
                >
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                  />
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`flex-1 cursor-pointer ${
                      task.completed ? "line-through text-muted-foreground" : "text-foreground"
                    }`}
                  >
                    {task.title}
                  </label>
                  <Badge variant={task.completed ? "secondary" : "default"}>
                    {task.completed ? "Done" : "Pending"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTask(task.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    aria-label={`Delete task: ${task.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Progress Bar */}
          {totalTasks > 0 && (
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Progress</span>
                <span>
                  {completedTasks} of {totalTasks} completed
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
