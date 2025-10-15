'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Check } from 'lucide-react';

// Define the structure for a single task
interface Task {
  id: string;
  description: string;
  note: string;
  technicianName: string;
  checkedByName: string;
  done: boolean;
  verified: boolean;
  parts: string[];
  newPart: string;
}

// Initial tasks for each sub
const initialSubs: Record<string, Task[]> = {
  CSS092: [
    {
      id: 't1',
      description: 'Sleeve damaged LV cables from transformer to LV board',
      note: '',
      technicianName: '',
      checkedByName: '',
      done: false,
      verified: false,
      parts: [],
      newPart: '',
    },
    {
      id: 't2',
      description: 'Fan cable needs to be installed back into the fan motor',
      note: '',
      technicianName: '',
      checkedByName: '',
      done: false,
      verified: false,
      parts: [],
      newPart: '',
    },
    {
      id: 't3',
      description: 'Busbar needs extra screws to hold any loose plates in place',
      note: '',
      technicianName: '',
      checkedByName: '',
      done: false,
      verified: false,
      parts: [],
      newPart: '',
    },
    {
      id: 't4',
      description: 'General clean up of the area',
      note: '',
      technicianName: '',
      checkedByName: '',
      done: false,
      verified: false,
      parts: [],
      newPart: '',
    },
  ],
  CSS068: [
    {
      id: 't1',
      description: 'Repair control cables',
      note: '',
      technicianName: '',
      checkedByName: '',
      done: false,
      verified: false,
      parts: [],
      newPart: '',
    },
    {
      id: 't2',
      description: 'Repair broken trunking',
      note: '',
      technicianName: '',
      checkedByName: '',
      done: false,
      verified: false,
      parts: [],
      newPart: '',
    },
    {
      id: 't3',
      description: 'Replace hinges in the ABB area',
      note: '',
      technicianName: '',
      checkedByName: '',
      done: false,
      verified: false,
      parts: [],
      newPart: '',
    },
    {
      id: 't4',
      description: 'General clean up',
      note: '',
      technicianName: '',
      checkedByName: '',
      done: false,
      verified: false,
      parts: [],
      newPart: '',
    },
  ],
  CSS023: [
    {
      id: 't1',
      description: 'Re-install light and fix conduit',
      note: '',
      technicianName: '',
      checkedByName: '',
      done: false,
      verified: false,
      parts: [],
      newPart: '',
    },
    {
      id: 't2',
      description: 'General clean up',
      note: '',
      technicianName: '',
      checkedByName: '',
      done: false,
      verified: false,
      parts: [],
      newPart: '',
    },
  ],
};

export default function App() {
  // Active tab (sub)
  const [active, setActive] = useState<string>('CSS092');
  // State of subs and tasks
  const [subs, setSubs] = useState<Record<string, Task[]>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pbe-sub-repair-v1');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved state', e);
        }
      }
    }
    return initialSubs;
  });

  // Persist to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pbe-sub-repair-v1', JSON.stringify(subs));
    }
  }, [subs]);

  // Helper to compute progress
  const computeProgress = (tasks: Task[]) => {
    const total = tasks.length * 2; // mark done + verify
    const doneCount = tasks.reduce((acc, t) => acc + (t.done ? 1 : 0) + (t.verified ? 1 : 0), 0);
    return total === 0 ? 0 : Math.round((doneCount / total) * 100);
  };

  // Add a new task
  const addTask = (subKey: string) => {
    const newTask: Task = {
      id: 'task-' + Date.now().toString(),
      description: '',
      note: '',
      technicianName: '',
      checkedByName: '',
      done: false,
      verified: false,
      parts: [],
      newPart: '',
    };
    setSubs((prev) => ({ ...prev, [subKey]: [...prev[subKey], newTask] }));
  };

  // Update any field in a task
  const updateTaskField = (subKey: string, taskId: string, field: keyof Task, value: any) => {
    setSubs((prev) => {
      const updatedTasks = prev[subKey].map((task) => (task.id === taskId ? { ...task, [field]: value } : task));
      return { ...prev, [subKey]: updatedTasks };
    });
  };

  // Mark done
  const markDone = (subKey: string, taskId: string) => {
    setSubs((prev) => {
      const updated = prev[subKey].map((t) =>
        t.id === taskId ? { ...t, done: !t.done, verified: t.done ? false : t.verified } : t
      );
      return { ...prev, [subKey]: updated };
    });
  };

  // Verify
  const verifyTask = (subKey: string, taskId: string) => {
    setSubs((prev) => {
      const updated = prev[subKey].map((t) => (t.id === taskId ? { ...t, verified: !t.verified } : t));
      return { ...prev, [subKey]: updated };
    });
  };

  // Add part
  const addPartToTask = (subKey: string, taskId: string) => {
    setSubs((prev) => {
      const updated = prev[subKey].map((t) => {
        if (t.id === taskId && t.newPart.trim()) {
          return { ...t, parts: [...t.parts, t.newPart.trim()], newPart: '' };
        }
        return t;
      });
      return { ...prev, [subKey]: updated };
    });
  };

  // Remove part
  const removePart = (subKey: string, taskId: string, index: number) => {
    setSubs((prev) => {
      const updated = prev[subKey].map((t) => {
        if (t.id === taskId) {
          const parts = [...t.parts];
          parts.splice(index, 1);
          return { ...t, parts };
        }
        return t;
      });
      return { ...prev, [subKey]: updated };
    });
  };

  const tasks = subs[active];
  const progress = computeProgress(tasks);

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">PBE Sub Repair &amp; Verification</h1>
      <p className="text-sm text-gray-600 mb-4">Site: T2D Precast Facility</p>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.keys(subs).map((key) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              active === key ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {key}
          </button>
        ))}
      </div>
      {/* Progress bar */}
      <div className="w-full h-3 bg-gray-200 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-green-600 transition-all"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      {/* Task list */}
      <div className="space-y-6">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white border rounded-xl shadow-sm p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Task Description</label>
              <input
                type="text"
                value={task.description}
                onChange={(e) => updateTaskField(active, task.id, 'description', e.target.value)}
                placeholder="Enter description for this task"
                className="w-full border rounded-md p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Notes / anomaly details</label>
              <textarea
                value={task.note}
                onChange={(e) => updateTaskField(active, task.id, 'note', e.target.value)}
                placeholder="Enter notes (optional)"
                className="w-full border rounded-md p-2 text-sm min-h-[80px]"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Technician section */}
              <div>
                <label className="block text-xs font-medium mb-1">Technician Name (for this task)</label>
                <input
                  type="text"
                  value={task.technicianName}
                  onChange={(e) => updateTaskField(active, task.id, 'technicianName', e.target.value)}
                  placeholder="Type full name of person who completed work"
                  className="w-full border rounded-md p-2 text-sm mb-2"
                />
                <button
                  onClick={() => markDone(active, task.id)}
                  disabled={!task.technicianName.trim()}
                  className={`w-full px-3 py-2 rounded-md text-sm font-medium ${
                    task.done ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                  } disabled:bg-gray-200 disabled:text-gray-400`}
                >
                  {task.done ? 'Marked Done' : 'Mark Done'}
                </button>
              </div>
              {/* Site verification section */}
              <div>
                <label className="block text-xs font-medium mb-1">Checked by (site verification)</label>
                <input
                  type="text"
                  value={task.checkedByName}
                  onChange={(e) => updateTaskField(active, task.id, 'checkedByName', e.target.value)}
                  placeholder="Type full name of verifier"
                  className="w-full border rounded-md p-2 text-sm mb-2"
                />
                <button
                  onClick={() => verifyTask(active, task.id)}
                  disabled={!task.done || !task.checkedByName.trim()}
                  className={`w-full px-3 py-2 rounded-md text-sm font-medium ${
                    task.verified ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
                  } disabled:bg-gray-200 disabled:text-gray-400`}
                >
                  {task.verified ? 'Verified' : 'Verify (after Tech)'}
                </button>
              </div>
            </div>
            {/* Parts section */}
            <div className="pt-3 border-t">
              <div className="text-sm font-medium mb-1">Parts Needed</div>
              {task.parts.length === 0 && (
                <div className="text-sm text-gray-500 mb-2">No parts added</div>
              )}
              {task.parts.map((part, idx) => (
                <div key={idx} className="flex items-center text-sm mb-1">
                  <span className="flex-1">{part}</span>
                  <button
                    onClick={() => removePart(active, task.id, idx)}
                    className="ml-2 text-xs text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={task.newPart}
                  onChange={(e) => updateTaskField(active, task.id, 'newPart', e.target.value)}
                  placeholder="Add part"
                  className="flex-1 border rounded-md p-2 text-sm"
                />
                <button
                  onClick={() => addPartToTask(active, task.id)}
                  disabled={!task.newPart.trim()}
                  className="px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white disabled:bg-gray-200 disabled:text-gray-400"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <button
          onClick={() => addTask(active)}
          className="px-4 py-2 border rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200"
        >
          Add New Item
        </button>
      </div>
    </main>
  );
}