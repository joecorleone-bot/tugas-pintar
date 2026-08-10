'use client';

import { useMemo, useState } from 'react';
import { Activity, Bell, CalendarDays, CheckCircle2, ChevronRight, Clock3, Crosshair, FileText, Filter, Globe2, LayoutDashboard, MapPin, Menu, Navigation, Plus, Search, Settings2, ShieldCheck, Users, X } from 'lucide-react';

type Tab = 'Dashboard' | 'Live Map' | 'Staff' | 'Customers' | 'Activity' | 'Reports';
type Staff = { id:number; name:string; role:string; status:'On site'|'Travelling'|'Offline'; customer:string; location:string; lastSeen:string; initials:string };

const staff: Staff[] = [
  {id:1,name:'Amir Hakim',role:'Field Engineer',status:'On site',customer:'Petronas KLCC',location:'Kuala Lumpur',lastSeen:'2 min ago',initials:'AH'},
  {id:2,name:'Sarah Lim',role:'Account Manager',status:'Travelling',customer:'Bank Rakyat',location:'Petaling Jaya',lastSeen:'5 min ago',initials:'SL'},
  {id:3,name:'Farid Zain',role:'Technical Consultant',status:'On site',customer:'DOSM',location:'Putrajaya',lastSeen:'8 min ago',initials:'FZ'},
  {id:4,name:'Nadia Azmi',role:'Support Engineer',status:'Travelling',customer:'SUK Selangor',location:'Shah Alam',lastSeen:'12 min ago',initials:'NA'},
  {id:5,name:'Daniel Wong',role:'Field Engineer',status:'Offline',customer:'—',location:'Subang Jaya',lastSeen:'Yesterday',initials:'DW'},
];

const customers = [
  {name:'Petronas KLCC',city:'Kuala Lumpur',staff:'Amir Hakim',visit:'On site now',tag:'Active'},
  {name:'Bank Rakyat',city:'Kuala Lumpur',staff:'Sarah Lim',visit:'En route · 18 min',tag:'Visit'},
  {name:'DOSM',city:'Putrajaya',staff:'Farid Zain',visit:'On site now',tag:'Active'},
  {name:'SUK Selangor',city:'Shah Alam',staff:'Nadia Azmi',visit:'En route · 11 min',tag:'Visit'},
];

const activities = [
  ['Amir Hakim','Checked in at Petronas KLCC','09:42 AM','check'],
  ['Sarah Lim','Started travel to Bank Rakyat','09:37 AM','move'],
  ['Farid Zain','Uploaded service report · DOSM','09:18 AM','file'],
  ['Nadia Azmi','Checked in at SUK Selangor','09:05 AM','check'],
  ['Daniel Wong','Signed out','Yesterday · 06:12 PM','clock'],
];

export default function Home(){
  const [tab,setTab]=useState<Tab>('Dashboard');
  const [query,setQuery]=useState('');
  const [selected,setSelected]=useState<Staff|null>(null);
  const [mobile,setMobile]=useState(false);
  const [notice,setNotice]=useState(false);
  const filteredStaff=useMemo(()=>staff.filter(s=>(s.name+' '+s.role+' '+s.customer+' '+s.location).toLowerCase().includes(query.toLowerCase())),[query]);
  const online=staff.filter(s=>s.status!=='Offline').length;

  const nav=(name:Tab,icon:React.ReactNode)=><button className={`navItem ${tab===name?'active':''}`} onClick={()=>{setTab(name);setMobile(false)}}>{icon}<span>{name}</span>{name==='Live Map'&&<em>{online}</em>}</button>;

  return <div className="app">
    <aside className={`sidebar ${mobile?'open':''}`}>
      <div className="brand"><div className="brandMark"><Navigation size={20}/></div><div><b>OMBAK</b><small>FIELD HUB</small></div><button className="closeMobile" onClick={()=>setMobile(false)}><X size={18}/></button></div>
      <div className="navLabel">WORKSPACE</div>
      {nav('Dashboard',<LayoutDashboard size={18}/>)}
      {nav('Live Map',<Globe2 size={18}/>)}
      {nav('Staff',<Users size={18}/>)}
      {nav('Customers',<MapPin size={18}/>)}
      {nav('Activity',<Activity size={18}/>)}
      {nav('Reports',<FileText size={18}/>)}
      <div className="sideNote"><ShieldCheck size={18}/><div><b>Privacy first</b><span>Location sharing is visible to staff.</span></div></div>
      <button className="settings"><Settings2 size={17}/> Settings</button>
      <div className="user"><div className="avatar">JH</div><div><b>Joe Hadznoel</b><span>Administrator</span></div><ChevronRight size={15}/></div>
    </aside>

    <main className="main">
      <header className="header"><button className="hamb" onClick={()=>setMobile(true)}><Menu size={20}/></button><div><span className="eyebrow">MONDAY · 10 AUGUST 2026</span><h1>{tab==='Dashboard'?'Good morning, Joe 👋':tab}</h1><p>{tab==='Dashboard'?'A clear view of your team, customers and field activity.':`Manage your ${tab.toLowerCase()} from one place.`}</p></div><div className="headActions"><button className="iconBtn"><Bell size={18}/><i/></button><div className="profile">JH</div></div></header>

      {tab==='Dashboard'&&<>
        <section className="hero"><div><span className="pill"><span className="dot"/> Live operations</span><h2>Your field team at a glance.</h2><p>See who is working, where they are, and what needs attention.</p></div><button className="primary" onClick={()=>setTab('Live Map')}><Navigation size={17}/> Open live map</button></section>
        <div className="metrics"><Metric icon={<Users/>} label="Team online" value={`${online}/${staff.length}`} note="active today"/><Metric icon={<MapPin/>} label="Customer visits" value="12" note="4 in progress"/><Metric icon={<CheckCircle2/>} label="Completed today" value="27" note="↑ 14% vs last Monday"/><Metric icon={<Clock3/>} label="Avg. response" value="18m" note="within target"/></div>
        <div className="grid two"><Panel title="Live team" action="View all" onClick={()=>setTab('Staff')}><div className="staffRows">{staff.slice(0,4).map(s=><StaffRow key={s.id} s={s} onClick={()=>setSelected(s)}/>)}</div></Panel><Panel title="Today’s activity" action="View log" onClick={()=>setTab('Activity')}><ActivityList/></Panel></div>
        <div className="grid two bottom"><Panel title="Customer visits" action="Open customers" onClick={()=>setTab('Customers')}><div className="customerCards">{customers.slice(0,3).map(c=><div className="customerCard" key={c.name}><div className="pin"><MapPin size={16}/></div><div><b>{c.name}</b><span>{c.city} · {c.staff}</span></div><strong className={c.tag==='Active'?'green':''}>{c.visit}</strong></div>)}</div></Panel><Panel title="Coverage today"><div className="coverage"><div className="ring"><b>86%</b><span>coverage</span></div><div className="coverageText"><b>Good field coverage</b><span>Most planned customer visits are assigned.</span><div className="miniBar"><i/></div><small>31 of 36 visits assigned</small></div></div></Panel></div>
      </>}

      {tab==='Live Map'&&<MapView staff={staff} selected={selected} onSelect={setSelected}/>} 
      {tab==='Staff'&&<StaffView staff={filteredStaff} query={query} setQuery={setQuery} onSelect={setSelected}/>} 
      {tab==='Customers'&&<CustomersView/>}
      {tab==='Activity'&&<ActivityView/>}
      {tab==='Reports'&&<ReportsView/>}

      <footer>OMBAK ASSOCIATES · Field Operations Hub · Demo data for prototype</footer>
    </main>
    {selected&&<div className="drawerBack" onClick={()=>setSelected(null)}><aside className="drawer" onClick={e=>e.stopPropagation()}><div className="drawerHead"><div className="bigAvatar">{selected.initials}</div><button onClick={()=>setSelected(null)}><X size={19}/></button></div><h2>{selected.name}</h2><p>{selected.role}</p><span className={`status ${selected.status==='On site'?'onsite':selected.status==='Travelling'?'travel':'offline'}`}><i/> {selected.status}</span><div className="detailMap"><MapPin size={18}/><div><b>{selected.location}</b><span>Last location update · {selected.lastSeen}</span></div></div><div className="drawerBlock"><span>Current assignment</span><b>{selected.customer}</b><small>Location sharing: enabled</small></div><button className="primary wide" onClick={()=>setNotice(true)}><Crosshair size={17}/> Request location update</button>{notice&&<div className="toast">Request sent to {selected.name}.</div>}</aside></div>}
  </div>
}

function Metric({icon,label,value,note}:{icon:React.ReactNode;label:string;value:string;note:string}){return <div className="metric"><div className="metricIcon">{icon}</div><div><span>{label}</span><b>{value}</b><small>{note}</small></div></div>}
function Panel({title,action,onClick,children}:{title:string;action?:string;onClick?:()=>void;children:React.ReactNode}){return <section className="panel"><div className="panelHead"><div><h3>{title}</h3><span>Updated just now</span></div>{action&&<button onClick={onClick}>{action}<ChevronRight size={14}/></button>}</div>{children}</section>}
function StaffRow({s,onClick}:{s:Staff;onClick:()=>void}){return <button className="staffRow" onClick={onClick}><div className="staffAvatar">{s.initials}<i className={s.status==='Offline'?'off':''}/></div><div className="staffMain"><b>{s.name}</b><span>{s.role}</span></div><div className="staffPlace"><MapPin size={13}/>{s.location}<small>{s.lastSeen}</small></div><ChevronRight size={15} className="rowArrow"/></button>}
function ActivityList(){return <div className="activityList">{activities.slice(0,4).map((a,i)=><div className="activity" key={i}><div className={`activityIcon ${a[3]}`}><Activity size={15}/></div><div><b>{a[0]}</b><span>{a[1]}</span></div><time>{a[2]}</time></div>)}</div>}
function MapView({staff,selected,onSelect}:{staff:Staff[];selected:Staff|null;onSelect:(s:Staff)=>void}){return <div className="mapPage"><div className="mapToolbar"><div><h2>Live location map</h2><p>{staff.filter(s=>s.status!=='Offline').length} staff sharing location · refreshed 30 seconds ago</p></div><div className="mapFilters"><button className="chosen"><Users size={15}/> Staff</button><button><MapPin size={15}/> Customers</button><button><Filter size={15}/> Filters</button></div></div><div className="mapCanvas"><div className="mapGrid"/><div className="road r1"/><div className="road r2"/><div className="road r3"/><div className="road r4"/>{staff.filter(s=>s.status!=='Offline').map((s,i)=><button key={s.id} className={`mapPin m${i+1} ${selected?.id===s.id?'selected':''}`} onClick={()=>onSelect(s)}><span>{s.initials}</span><b>{s.name}</b></button>)}<div className="mapLabel kl">KUALA LUMPUR</div><div className="mapLabel pj">PETALING JAYA</div><div className="mapLabel put">PUTRAJAYA</div><div className="mapScale">2 km</div><div className="mapLegend"><b>Live status</b><span><i className="greenDot"/> On site</span><span><i className="amberDot"/> Travelling</span><span><i className="greyDot"/> Offline</span></div></div></div>}
function StaffView({staff,query,setQuery,onSelect}:{staff:Staff[];query:string;setQuery:(v:string)=>void;onSelect:(s:Staff)=>void}){return <div className="fullPage"><div className="pageTools"><div><h2>Staff directory</h2><p>People, assignments and current field status.</p></div><button className="primary"><Plus size={17}/> Add staff</button></div><div className="tableCard"><div className="tableSearch"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search staff, role or customer..."/></div><div className="tableHead"><span>STAFF MEMBER</span><span>STATUS</span><span>CURRENT CUSTOMER</span><span>LOCATION</span><span>LAST UPDATE</span></div>{staff.map(s=><button className="tableRow" key={s.id} onClick={()=>onSelect(s)}><div className="tablePerson"><div className="staffAvatar">{s.initials}<i className={s.status==='Offline'?'off':''}/></div><div><b>{s.name}</b><span>{s.role}</span></div></div><span className={`status ${s.status==='On site'?'onsite':s.status==='Travelling'?'travel':'offline'}`}><i/> {s.status}</span><span>{s.customer}</span><span>{s.location}</span><span>{s.lastSeen}</span></button>)}</div></div>}
function CustomersView(){return <div className="fullPage"><div className="pageTools"><div><h2>Customer locations</h2><p>Keep visits, contacts and field assignments in one place.</p></div><button className="primary"><Plus size={17}/> Add customer</button></div><div className="customerGrid">{customers.map(c=><div className="customerLarge" key={c.name}><div className="customerTop"><div className="customerLogo"><MapPin size={18}/></div><span className="tag">{c.tag}</span></div><h3>{c.name}</h3><p>{c.city}</p><div className="assigned"><div className="staffAvatar">{staff.find(s=>s.name===c.staff)?.initials}</div><span><small>Assigned staff</small><b>{c.staff}</b></span></div><button>View location <ChevronRight size={15}/></button></div>)}</div></div>}
function ActivityView(){return <div className="fullPage"><div className="pageTools"><div><h2>Activity log</h2><p>A chronological record of field activity.</p></div><button className="secondary"><CalendarDays size={16}/> Today</button></div><div className="logCard"><div className="logSummary"><b>39</b><span>events today</span><b>12</b><span>customer visits</span><b>27</b><span>tasks completed</span></div><ActivityList/><ActivityList/></div></div>}
function ReportsView(){return <div className="fullPage"><div className="pageTools"><div><h2>Operations reports</h2><p>Quick snapshots for your weekly review.</p></div><button className="secondary"><CalendarDays size={16}/> This week</button></div><div className="reportGrid"><div className="report"><span>Customer visits</span><b>64</b><div className="reportBar"><i style={{width:'82%'}}/></div><small>82% of weekly target</small></div><div className="report"><span>Field utilisation</span><b>78%</b><div className="reportBar"><i style={{width:'78%'}}/></div><small>+6% from last week</small></div><div className="report"><span>On-time arrival</span><b>91%</b><div className="reportBar"><i style={{width:'91%'}}/></div><small>Above 90% target</small></div><div className="report"><span>Activity captured</span><b>96%</b><div className="reportBar"><i style={{width:'96%'}}/></div><small>Location + visit events</small></div></div></div>}
