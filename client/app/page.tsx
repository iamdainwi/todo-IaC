"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  PencilSimpleIcon,
  TrashIcon,
  XIcon,
  CheckCircleIcon,
  CircleIcon,
  SpinnerGapIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export type Todo = {
  todo_id: string;
  todo_name: string;
  todo_desc: string;
  todo_status: boolean;
};

type TodoItemProps = {
  todo: Todo;
  onUpdate: (updated: Todo) => void;
  onDelete: (id: string) => void;
};

function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [editName, setEditName] = useState(todo.todo_name);
  const [editDesc, setEditDesc] = useState(todo.todo_desc || "");
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      editInputRef.current?.focus();
    }
  }, [editing]);

  const handleToggle = async () => {
    if (toggling) return;
    setToggling(true);
    try {
      const res = await axios.patch(`/api/todo/${todo.todo_id}`, {
        todo_status: !todo.todo_status,
      });
      onUpdate({ ...todo, ...res.data });
    } catch {
      // silently fail — could add toast here
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`/api/todo/${todo.todo_id}`);
      onDelete(todo.todo_id);
    } catch {
      setDeleting(false);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      setEditing(false);
      setEditName(todo.todo_name);
      setEditDesc(todo.todo_desc || "");
      return;
    }

    try {
      const res = await axios.patch(`/api/todo/${todo.todo_id}`, {
        todo_name: editName.trim(),
        todo_desc: editDesc.trim(),
      });
      onUpdate({ ...todo, ...res.data });
      setEditing(false);
    } catch {
      // handle error
      setEditName(todo.todo_name);
      setEditDesc(todo.todo_desc || "");
    }
  };

  return (
    <div
      className={cn(
        "group relative flex items-start gap-4 py-3 transition-opacity duration-200",
        todo.todo_status && "opacity-50",
        deleting && "opacity-30 pointer-events-none",
      )}
    >
      <button
        type="button"
        onClick={handleToggle}
        disabled={toggling}
        className={cn(
          "mt-0.5 flex shrink-0 items-center justify-center rounded-none text-muted-foreground transition-colors outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
          todo.todo_status && "text-primary check-pulse",
        )}
        aria-label={todo.todo_status ? "Mark incomplete" : "Mark complete"}
      >
        {toggling ? (
          <SpinnerGapIcon className="size-5 animate-spin" />
        ) : todo.todo_status ? (
          <CheckCircleIcon className="size-5" weight="fill" />
        ) : (
          <CircleIcon className="size-5 hover:text-foreground" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        {editing ? (
          <form
            onSubmit={handleSaveEdit}
            className="flex flex-col gap-1 w-full"
          >
            <div className="flex items-center gap-2">
              <Input
                ref={editInputRef}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="h-7 text-sm font-medium bg-transparent border-b border-primary/50 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
                placeholder="Task name"
              />
              <Button
                type="button"
                size="icon-xs"
                variant="ghost"
                onClick={() => {
                  setEditing(false);
                  setEditName(todo.todo_name);
                  setEditDesc(todo.todo_desc || "");
                }}
              >
                <XIcon className="size-4" />
              </Button>
            </div>
            <Input
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="h-6 text-xs text-muted-foreground bg-transparent border-b border-border/50 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary placeholder:text-muted-foreground/50"
              placeholder="Description (optional)"
            />
            <button type="submit" className="hidden">
              Save
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-1">
            <span
              className={cn(
                "text-sm font-medium leading-tight",
                todo.todo_status && "line-through",
              )}
            >
              {todo.todo_name}
            </span>
            {todo.todo_desc && (
              <span
                className={cn(
                  "text-xs text-muted-foreground leading-snug",
                  todo.todo_status && "line-through",
                )}
              >
                {todo.todo_desc}
              </span>
            )}
          </div>
        )}
      </div>

      {!editing && (
        <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <button
            onClick={() => setEditing(true)}
            className="text-muted-foreground hover:text-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring p-1"
            aria-label="Edit"
          >
            <PencilSimpleIcon className="size-4" />
          </button>
          <button
            onClick={handleDelete}
            className="text-muted-foreground hover:text-destructive outline-none focus-visible:ring-1 focus-visible:ring-ring p-1"
            aria-label="Delete"
          >
            {deleting ? (
              <SpinnerGapIcon className="size-4 animate-spin" />
            ) : (
              <TrashIcon className="size-4" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "done">("all");

  // Add state
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get("/api/todo");
        setTodos(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching todos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const handleUpdate = (updated: Todo) => {
    setTodos((prev) =>
      prev.map((t) => (t.todo_id === updated.todo_id ? updated : t)),
    );
  };

  const handleDelete = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.todo_id !== id));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || adding) return;

    setAdding(true);
    try {
      const res = await axios.post("/api/todo", {
        todo_name: newName.trim(),
        todo_desc: newDesc.trim(),
        todo_status: false,
      });
      setTodos((prev) => [res.data, ...prev]);
      setNewName("");
      setNewDesc("");
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const filteredTodos = todos.filter((t) => {
    if (filter === "active") return !t.todo_status;
    if (filter === "done") return t.todo_status;
    return true;
  });

  const activeCount = todos.filter((t) => !t.todo_status).length;
  const doneCount = todos.filter((t) => t.todo_status).length;

  return (
    <main className="min-h-screen bg-background flex justify-center px-6 py-16 md:py-24">
      <div className="w-full max-w-2xl flex flex-col gap-10">
        {/* Header */}
        <header className="flex items-end justify-between">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Tasks
          </h1>

          {todos.length > 0 && (
            <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
              <button
                onClick={() => setFilter("all")}
                className={cn(
                  "hover:text-foreground transition-colors",
                  filter === "all" && "text-primary",
                )}
              >
                all {todos.length}
              </button>
              <button
                onClick={() => setFilter("active")}
                className={cn(
                  "hover:text-foreground transition-colors",
                  filter === "active" && "text-primary",
                )}
              >
                active {activeCount}
              </button>
              <button
                onClick={() => setFilter("done")}
                className={cn(
                  "hover:text-foreground transition-colors",
                  filter === "done" && "text-primary",
                )}
              >
                done {doneCount}
              </button>
            </div>
          )}
        </header>

        {/* List Container */}
        <div className="flex flex-col border-t border-border">
          {/* Inline Add Form */}
          <form
            onSubmit={handleAddSubmit}
            className="flex items-start gap-4 py-4 border-b border-border"
          >
            <div className="mt-1 flex shrink-0 items-center justify-center text-muted-foreground/50">
              {adding ? (
                <SpinnerGapIcon className="size-5 animate-spin" />
              ) : (
                <PlusIcon className="size-5" />
              )}
            </div>
            <div className="flex flex-col w-full gap-1">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="New task..."
                className="h-auto p-0 text-sm font-medium bg-transparent border-0 rounded-none focus-visible:ring-0 placeholder:text-muted-foreground/50"
                disabled={adding}
              />
              <Input
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Description (optional)"
                className="h-auto p-0 text-xs text-muted-foreground bg-transparent border-0 rounded-none focus-visible:ring-0 placeholder:text-muted-foreground/40"
                disabled={adding}
              />
              <button type="submit" className="hidden">
                Add
              </button>
            </div>
          </form>

          {/* List Items */}
          <div className="flex flex-col">
            {loading ? (
              <div className="py-8 text-sm text-muted-foreground text-center">
                Loading tasks...
              </div>
            ) : filteredTodos.length === 0 ? (
              <div className="py-12 text-sm text-muted-foreground text-center">
                {filter === "all"
                  ? "No tasks yet. Add one above."
                  : `No ${filter} tasks.`}
              </div>
            ) : (
              filteredTodos.map((todo, idx) => (
                <div
                  key={todo.todo_id}
                  className="item-enter border-b border-border"
                >
                  <TodoItem
                    todo={todo}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
