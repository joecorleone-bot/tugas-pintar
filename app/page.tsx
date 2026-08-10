'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Check, Circle, LayoutDashboard, Plus, Search, Trash2, Waves } from 'lucide-react';

type Task = { id: number; title: string; done: boolean; priority: 'High' | 'Medium' | 'Low'; category: string };

const initialTasks: Task[] = [
  { id: 1, title: 'Semak email penting', done: false, priority: 'High', category: 'Admin' },
  { id: 2, title: 'Follow up quotation', done: false, priority: 'High', category: 'Sales' },
  { id: 3, title: 'Update project status', done: true, priority: 'Medium', category: 'Project' },
  { id: 4, title: 'Prepare weekly team update', done: false, priority: 'Medium', category: 'Project' },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ombak-tasks-v2');
    if (saved) { try { setTasks(JSON.parse(saved)); } catch {} }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem('ombak-tasks-v2', JSON.stringify(tasks)); }, [tasks, ready]);

  const done = tasks.filter(t => t.done).length;
  const pending = tasks.length - done;
  const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const visible = useMemo(() => tasks.filter(t => {
    const matchesFilter = filter === 'All' || (filter === 'Pending' ? !t.done : t.done) || filter === t.category;
    return matchesFilter && t.title.toLowerCase().includes(search.toLowerCase());
  }), [tasks, filter, search]);

  function addTask(e: React.FormEvent) {
    e.preventDefault(); const title = text.trim(); if (!title) return;
    setTasks(p => [{ id: Date.now(), title, done: false, priority: 'Medium', category: 'General' }, ...p]); setText('');
  }

  return (
    <main className="dashboard">
      <aside className="sidebar">
        <div className="logo"><span><Waves size={21}/></span><div><b>OMBAK</b><small>ASSOCIATES</small></div></div>
        <div className="sideTitle">WORKSPACE</div>
        <button className="sideItem active"><LayoutDashboard size={18}/> Dashboard</button>
        <button className="sideItem"><CalendarDays size={18}/> My Tasks</button>
        <div className="sideBottom"><div className="miniWave"><Waves size={28}/></div><b>Keep moving forward.</b><small>Ombak Productivity Hub</small></div>
      </aside>

      <section className="content">
        <header className="topbar"><div><span className="kicker">MONDAY · 10 AUGUST 2026</span><h1>Good morning, Joe <span>👋</span></h1><p>Here's what needs your attention today.</p></div><div className="profile">JH</div></header>

        <div className="stats">
          <div className="stat"><span>Total Tasks</span><strong>{tasks.length}</strong><small>in your workspace</small></div>
          <div className="stat"><span>Pending</span><strong>{pending}</strong><small>need your attention</small></div>
          <div className="stat"><span>Completed</span><strong>{done}</strong><small>tasks finished</small></div>
          <div className="stat progressStat"><span>Daily Progress</span><strong>{progress}%</strong><div className="progress"><i style={{width:`${progress}%`}}/></div></div>
        </div>

        <div className="sectionHead"><div><h2>Today</h2><p>Focus on what matters most.</p></div><form onSubmit={addTask} className="newTask"><input value={text} onChange={e=>setText(e.target.value)} placeholder="Add a new task..."/><button><Plus size={18}/> Add Task</button></form></div>

        <div className="toolbar"><div className="filters">{['All','Pending','Done','Sales','Project','Admin'].map(f=><button type="button" key={f} className={filter===f?'chosen':''} onClick={()=>setFilter(f)}>{f}</button>)}</div><label className="search"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tasks..."/></label></div>

        <div className="taskList">{visible.length===0?<div className="empty">No tasks found.</div>:visible.map(task=><div className={`taskRow ${task.done?'isDone':''}`} key={task.id}>
          <button className="check" type="button" onClick={()=>setTasks(p=>p.map(t=>t.id===task.id?{...t,done:!t.done}:t))}>{task.done?<Check size={16}/>:<Circle size={17}/>}</button>
          <div className="taskInfo"><b>{task.title}</b><span>{task.category}</span></div>
          <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
          <button className="trash" type="button" onClick={()=>setTasks(p=>p.filter(t=>t.id!==task.id))}><Trash2 size={17}/></button>
        </div>)}</div>
        <footer>OMBAK ASSOCIATES · Productivity Hub · Tasks are saved automatically on this device</footer>
      </section>
    </main>
  );
}
