import TaskManager from "../task-manager"

export const metadata = {
  title: "Taskify – Task Manager",
  description: "A modern task manager app built with Next.js and ShadCN UI.",
}

export default function Page() {
  return (
    <main>
      <TaskManager />
    </main>
  )
}
