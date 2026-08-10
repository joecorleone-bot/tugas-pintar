'use client';

import { useMemo, useState } from 'react';
import { Check, Circle, Plus, Trash2 } from 'lucide-react';

type Task = { id: number; title: string; done: boolean };

const initialTasks: Task[] = [
  { id: 1, title: 'Semak email penting', done: false },
  { id: 2, title: 'Follow up quotation', done: false },
  { id: 3, title: 'Update project status', done: true },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all');

  const visible = useMemo(() => tasks.filter(t => filter === 'all' || (filter === 'active' ? !t.done : t.done)), [tasks, filter]);
  const remaining = tasks.filter(t => !t.done).length;

  function addTask(e: React.FormEvent) {
    e.preventDefault();
    const title = text.trim();
    if (!title) return;
    setTasks(prev => [{ id: Date.now(), title, done: false }, ...prev]);
    setText('');
  }

  function toggle(id: number) { setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t)); }
  function remove(id: number) { setTasks(prev => prev.filter(t => t.id !== id)); }

  return (
    <main className="shell">
      <section className="card">
        <header>
          <div>
            <p className="eyebrow">PRODUCTIVITY</p>
            <h1>Tugas Pintar</h1>
            <p className="subtitle">Senarai tugasan harian anda</p>
          </div>
          <div className="count"><strong>{remaining}</strong><span>belum selesai</span></div>
        </header>

        <form className="add" onSubmit={addTask}>
          <input value={text} onChange={e => setText(e.target.value)} placeholder="Apa yang perlu dibuat?" aria-label="Tugas baru" />
          <button aria-label="Tambah tugas" type="submit"><Plus size={21} /></button>
        </form>

        <nav className="filters" aria-label="Penapis tugas">
          {(['all','active','done'] as const).map(f => <button key={f} className={filter === f ? 'selected' : ''} onClick={() => setFilter(f)}>{f === 'all' ? 'Semua' : f === 'active' ? 'Belum selesai' : 'Selesai'}</button>)}
        </nav>

        <div className="list">
          {visible.length === 0 ? <div className="empty">Tiada tugasan dalam kategori ini.</div> : visible.map(task => (
            <div className={`task ${task.done ? 'completed' : ''}`} key={task.id}>
              <button className="check" onClick={() => toggle(task.id)} aria-label={task.done ? 'Tanda belum selesai' : 'Tanda selesai'}>{task.done ? <Check size={18} /> : <Circle size={18} />}</button>
              <span>{task.title}</span>
              <button className="delete" onClick={() => remove(task.id)} aria-label="Padam tugas"><Trash2 size={17} /></button>
            </div>
          ))}
        </div>
        <footer>{tasks.length} tugasan · Data disimpan dalam sesi ini</footer>
      </section>
    </main>
  );
}