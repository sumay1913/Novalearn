import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, BarChart3, Bell, BookOpen, Bot, BrainCircuit, Check,
  ChevronDown, CirclePlay, Clock3, Code2, Compass, Flame, GraduationCap,
  LayoutDashboard, Library, LogOut, Menu, MoreHorizontal, Pencil, Plus, Search,
  Settings, Sparkles, Star, Target, Trash2, TrendingUp, Trophy, UserRound, Users, X
} from "lucide-react";
import { api } from "./api";
import { demoCourses, demoStudent } from "./data";

const AuthContext = createContext(null);
const categories = ["All", "Artificial Intelligence", "Design", "Development", "Data"];

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("novalearn_user")); } catch { return null; }
  });

  const authenticate = async (mode, fields) => {
    try {
      const data = await api(`/auth/${mode}`, { method: "POST", body: JSON.stringify(fields) });
      localStorage.setItem("novalearn_token", data.token);
      localStorage.setItem("novalearn_user", JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } catch (error) {
      const demoMatch =
        fields.email === "student@novalearn.dev" && fields.password === "student123" ||
        fields.email === "admin@novalearn.dev" && fields.password === "admin123";
      if (mode === "login" && demoMatch) {
        const demoUser = fields.email.startsWith("admin")
          ? { id: "admin", name: "Ava Morgan", email: fields.email, role: "admin", streak: 12 }
          : { id: "student", name: "Sam Wilson", email: fields.email, role: "student", streak: 7 };
        localStorage.setItem("novalearn_user", JSON.stringify(demoUser));
        localStorage.setItem("novalearn_demo", "true");
        setUser(demoUser);
        return demoUser;
      }
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("novalearn_token");
    localStorage.removeItem("novalearn_user");
    localStorage.removeItem("novalearn_demo");
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, authenticate, logout }}>{children}</AuthContext.Provider>;
}

const useAuth = () => useContext(AuthContext);
const initials = (name = "") => name.split(" ").map((part) => part[0]).join("").slice(0, 2);
const formatStudents = (count = 0) => count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count;

function Logo({ light = false }) {
  return (
    <Link to="/" className={`logo ${light ? "logo-light" : ""}`}>
      <span className="logo-mark"><Sparkles size={18} strokeWidth={2.5} /></span>
      <span>NovaLearn</span>
    </Link>
  );
}

function PublicNav() {
  const { user } = useAuth();
  return (
    <header className="public-nav">
      <Logo />
      <nav>
        <a href="#courses">Courses</a>
        <a href="#method">How it works</a>
        <a href="#stories">Stories</a>
      </nav>
      <div className="nav-actions">
        {user ? (
          <Link className="button button-dark" to={user.role === "admin" ? "/admin" : "/dashboard"}>
            Go to dashboard <ArrowRight size={16} />
          </Link>
        ) : (
          <>
            <Link className="text-button" to="/login">Log in</Link>
            <Link className="button button-dark" to="/register">Start learning <ArrowRight size={16} /></Link>
          </>
        )}
      </div>
    </header>
  );
}

function CourseArt({ course, compact = false }) {
  return (
    <div className={`course-art ${compact ? "compact" : ""}`} style={{ "--course-color": course.color }}>
      <div className="art-orbit orbit-one" />
      <div className="art-orbit orbit-two" />
      <div className="art-core">
        {course.category === "Development" ? <Code2 /> : course.category === "Design" ? <Sparkles /> : <BrainCircuit />}
      </div>
      <span className="art-label">{course.category}</span>
    </div>
  );
}

function CourseCard({ course, onEnroll, admin = false, onEdit, onDelete }) {
  return (
    <article className="course-card">
      <CourseArt course={course} />
      <div className="course-card-body">
        <div className="course-meta">
          <span>{course.level}</span><span>·</span><span>{course.duration}</span>
          {admin && <span className={`status ${course.published ? "live" : ""}`}>{course.published ? "Live" : "Draft"}</span>}
        </div>
        <h3>{course.title}</h3>
        <p>{course.description}</p>
        <div className="skill-row">{course.skills?.slice(0, 3).map((skill) => <span key={skill}>{skill}</span>)}</div>
        <div className="course-card-footer">
          <div className="rating"><Star size={15} fill="currentColor" /> {course.rating} <span>({formatStudents(course.studentCount)})</span></div>
          {admin ? (
            <div className="icon-actions">
              <button aria-label="Edit course" onClick={() => onEdit(course)}><Pencil size={16} /></button>
              <button aria-label="Delete course" onClick={() => onDelete(course)}><Trash2 size={16} /></button>
            </div>
          ) : onEnroll ? (
            <button className="circle-button" onClick={() => onEnroll(course)} aria-label={`Enroll in ${course.title}`}><ArrowRight size={18} /></button>
          ) : (
            <Link className="circle-button" to={`/courses/${course.slug}`}><ArrowRight size={18} /></Link>
          )}
        </div>
      </div>
    </article>
  );
}

function Home() {
  const [courses, setCourses] = useState(demoCourses);
  useEffect(() => { api("/courses").then((data) => setCourses(data.courses)).catch(() => {}); }, []);

  return (
    <div className="landing">
      <PublicNav />
      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span /> Learning, reimagined for the AI era</div>
            <h1>Build the skills<br />that shape <em>tomorrow.</em></h1>
            <p>Personalized learning paths, expert-led courses, and an AI coach that turns curiosity into real capability.</p>
            <div className="hero-actions">
              <Link className="button button-primary" to="/register">Explore your path <ArrowRight size={17} /></Link>
              <button className="watch-button"><span><CirclePlay size={18} /></span> See how it works</button>
            </div>
            <div className="hero-proof">
              <div className="avatar-stack"><span>MK</span><span>JL</span><span>PS</span><span>AR</span></div>
              <div><strong>12,000+ learners</strong><small>growing with NovaLearn</small></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="glow-sphere">
              <div className="sphere-ring ring-a" />
              <div className="sphere-ring ring-b" />
              <div className="sphere-center"><Sparkles size={34} /></div>
            </div>
            <div className="float-card ai-card">
              <span className="mini-icon"><Bot size={18} /></span>
              <div><small>AI LEARNING COACH</small><strong>Ready for your next step?</strong></div>
            </div>
            <div className="float-card progress-float">
              <div className="tiny-chart"><span /><span /><span /><span /><span /></div>
              <div><strong>+34%</strong><small>Weekly progress</small></div>
            </div>
            <div className="float-pill"><Flame size={16} fill="currentColor" /> 7 day streak</div>
          </div>
        </section>

        <section className="logo-strip">
          <span>Trusted by learners from</span>
          <strong>GOOGLE</strong><strong>notion</strong><strong>Spotify</strong><strong>VERCEL</strong><strong>linear</strong>
        </section>

        <section className="featured-section" id="courses">
          <div className="section-heading">
            <div><span className="kicker">CURATED FOR WHAT'S NEXT</span><h2>Learn from the edge.</h2></div>
            <Link to="/register">Browse all courses <ArrowRight size={16} /></Link>
          </div>
          <div className="course-grid">{courses.slice(0, 3).map((course) => <CourseCard key={course._id} course={course} />)}</div>
        </section>

        <section className="method-section" id="method">
          <div className="method-copy"><span className="kicker">A SMARTER WAY TO GROW</span><h2>Learning that learns<br />with you.</h2><p>Nova adapts to your goals, pace, and strengths so every session moves you meaningfully forward.</p></div>
          <div className="method-grid">
            <div className="method-card"><span>01</span><Target /><h3>Set your direction</h3><p>Tell us where you want to go. Nova maps the skills and milestones that will get you there.</p></div>
            <div className="method-card active"><span>02</span><BrainCircuit /><h3>Follow your path</h3><p>Your curriculum adapts as you learn, balancing challenge with momentum.</p></div>
            <div className="method-card"><span>03</span><TrendingUp /><h3>Prove your growth</h3><p>Build portfolio-ready projects and earn credentials that reflect what you can do.</p></div>
          </div>
        </section>
      </main>
      <footer><Logo light /><p>Learning for the world ahead.</p><span>© 2026 NovaLearn</span></footer>
    </div>
  );
}

function AuthPage({ mode }) {
  const { authenticate } = useAuth();
  const navigate = useNavigate();
  const [fields, setFields] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isLogin = mode === "login";

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true); setError("");
    try {
      const user = await authenticate(mode, fields);
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  const useDemo = (role) => setFields({
    name: "",
    email: role === "admin" ? "admin@novalearn.dev" : "student@novalearn.dev",
    password: role === "admin" ? "admin123" : "student123"
  });

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <Logo light />
        <div className="auth-quote"><Sparkles /><blockquote>“The beautiful thing about learning is that it changes what you believe is possible.”</blockquote><p>Designed for lifelong learners.</p></div>
        <div className="auth-orb" />
      </div>
      <div className="auth-panel">
        <Link className="back-link" to="/"><ArrowLeft size={16} /> Back home</Link>
        <div className="auth-form-wrap">
          <span className="kicker">{isLogin ? "WELCOME BACK" : "YOUR NEXT CHAPTER"}</span>
          <h1>{isLogin ? "Continue learning." : "Start building what's next."}</h1>
          <p>{isLogin ? "Your courses and progress are waiting for you." : "Create your account and get a learning path shaped around your goals."}</p>
          <form onSubmit={submit}>
            {!isLogin && <label>Full name<input value={fields.name} onChange={(e) => setFields({ ...fields, name: e.target.value })} placeholder="Your name" required /></label>}
            <label>Email address<input type="email" value={fields.email} onChange={(e) => setFields({ ...fields, email: e.target.value })} placeholder="you@example.com" required /></label>
            <label>Password<input type="password" value={fields.password} onChange={(e) => setFields({ ...fields, password: e.target.value })} placeholder="At least 6 characters" required /></label>
            {error && <div className="form-error">{error}</div>}
            <button className="button button-primary full" disabled={loading}>{loading ? "One moment..." : isLogin ? "Log in" : "Create account"} <ArrowRight size={17} /></button>
          </form>
          {isLogin && <div className="demo-box"><span>Try the demo</span><button onClick={() => useDemo("student")}>Student</button><button onClick={() => useDemo("admin")}>Admin</button></div>}
          <p className="auth-switch">{isLogin ? "New to NovaLearn?" : "Already have an account?"} <Link to={isLogin ? "/register" : "/login"}>{isLogin ? "Create an account" : "Log in"}</Link></p>
        </div>
      </div>
    </div>
  );
}

function Protected({ role, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
  return children;
}

function Sidebar({ admin = false, mobileOpen, close }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const items = admin
    ? [
        ["/admin", LayoutDashboard, "Overview"],
        ["/admin/courses", Library, "Courses"],
        ["#", Users, "Students"],
        ["#", BarChart3, "Analytics"]
      ]
    : [
        ["/dashboard", LayoutDashboard, "Overview"],
        ["/explore", Compass, "Discover"],
        ["#", BookOpen, "My learning"],
        ["#", Trophy, "Achievements"]
      ];
  return (
    <>
      {mobileOpen && <div className="sidebar-scrim" onClick={close} />}
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="sidebar-top"><Logo /><button className="mobile-close" onClick={close}><X /></button></div>
        <div className="sidebar-label">{admin ? "ADMIN WORKSPACE" : "LEARNING SPACE"}</div>
        <nav>{items.map(([href, Icon, label]) => <Link key={label} onClick={close} className={location.pathname === href ? "active" : ""} to={href}><Icon size={19} /><span>{label}</span></Link>)}</nav>
        {!admin && <div className="coach-card"><span><Bot size={20} /></span><strong>Ask Nova</strong><p>Your AI learning coach is here to help.</p><button>Start a conversation <ArrowRight size={14} /></button></div>}
        <div className="sidebar-bottom">
          <Link to="#"><Settings size={18} /> Settings</Link>
          <button onClick={logout}><LogOut size={18} /> Log out</button>
          <div className="user-chip"><span>{initials(user.name)}</span><div><strong>{user.name}</strong><small>{user.role === "admin" ? "Administrator" : "Learner"}</small></div><MoreHorizontal size={17} /></div>
        </div>
      </aside>
    </>
  );
}

function DashboardShell({ admin = false, children, title, subtitle, action }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="app-shell">
      <Sidebar admin={admin} mobileOpen={mobileOpen} close={() => setMobileOpen(false)} />
      <main className="dashboard-main">
        <header className="dashboard-header">
          <button className="mobile-menu" onClick={() => setMobileOpen(true)}><Menu /></button>
          <div><span className="page-kicker">{admin ? "ADMIN DASHBOARD" : "YOUR LEARNING SPACE"}</span><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>
          <div className="header-tools"><button className="notification"><Bell size={19} /><i /></button>{action}</div>
        </header>
        {children}
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, note, color }) {
  return <div className="stat-card"><span className="stat-icon" style={{ "--stat-color": color }}><Icon size={20} /></span><div><small>{label}</small><strong>{value}</strong><p>{note}</p></div></div>;
}

function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(demoStudent);
  useEffect(() => { if (!localStorage.getItem("novalearn_demo")) api("/dashboard/student").then(setData).catch(() => {}); }, []);
  const enrollments = data.enrollments || [];

  return (
    <DashboardShell title={`Good morning, ${user.name.split(" ")[0]}.`} subtitle="Small steps, remarkable direction. Let's keep moving.">
      <section className="stats-grid">
        <StatCard icon={Clock3} label="HOURS LEARNED" value={data.stats.hoursLearned} note="+4.5 this week" color="#7258df" />
        <StatCard icon={BookOpen} label="COURSES COMPLETED" value={data.stats.completed} note="2 in progress" color="#008d7b" />
        <StatCard icon={Flame} label="CURRENT STREAK" value={`${data.stats.streak} days`} note="Personal best: 12" color="#dc7430" />
        <StatCard icon={Trophy} label="CERTIFICATES" value={data.stats.certificates} note="View credentials" color="#d84f70" />
      </section>
      <section className="dashboard-grid">
        <div>
          <div className="block-heading"><div><span className="kicker">PICK UP WHERE YOU LEFT OFF</span><h2>Continue learning</h2></div><Link to="#">View all <ArrowRight size={15} /></Link></div>
          <div className="learning-list">
            {enrollments.map(({ course, progress, completedLessons }) => (
              <article className="learning-card" key={course._id}>
                <CourseArt course={course} compact />
                <div className="learning-info">
                  <span>{course.category}</span><h3>{course.title}</h3>
                  <p>Next: {course.lessons?.[Math.min(completedLessons, course.lessons.length - 1)]?.title}</p>
                  <div className="progress-row"><div className="progress-bar"><i style={{ width: `${progress}%` }} /></div><strong>{progress}%</strong></div>
                </div>
                <Link className="play-button" to={`/courses/${course.slug}`}><CirclePlay /></Link>
              </article>
            ))}
          </div>
        </div>
        <aside className="weekly-card">
          <div className="weekly-heading"><div><span className="kicker">THIS WEEK</span><h3>Your rhythm</h3></div><span className="trend-pill">+18%</span></div>
          <div className="week-bars">{[42, 66, 35, 82, 55, 94, 18].map((height, index) => <div key={index}><i style={{ height: `${height}%` }} className={index === 5 ? "today" : ""} /><span>{["M","T","W","T","F","S","S"][index]}</span></div>)}</div>
          <div className="weekly-total"><strong>4h 32m</strong><span>of your 5h weekly goal</span></div>
          <div className="goal-progress"><i style={{ width: "91%" }} /></div>
          <p><Target size={16} /> You're just <strong>28 minutes</strong> from your weekly goal.</p>
        </aside>
      </section>
      <section className="recommend-section">
        <div className="block-heading"><div><span className="kicker">CHOSEN FOR YOUR GOALS</span><h2>Nova recommends</h2></div><Link to="/explore">Explore more <ArrowRight size={15} /></Link></div>
        <div className="course-grid compact-grid">{data.recommendations?.map((course) => <CourseCard key={course._id} course={course} />)}</div>
      </section>
    </DashboardShell>
  );
}

function Explore() {
  const [courses, setCourses] = useState(demoCourses);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  useEffect(() => { api("/courses").then((data) => setCourses(data.courses)).catch(() => {}); }, []);
  const filtered = useMemo(() => courses.filter((course) =>
    (category === "All" || course.category === category) &&
    `${course.title} ${course.description} ${course.skills?.join(" ")}`.toLowerCase().includes(search.toLowerCase())
  ), [courses, category, search]);
  const enroll = async (course) => {
    try {
      if (!localStorage.getItem("novalearn_demo")) await api(`/dashboard/enroll/${course._id}`, { method: "POST" });
      setToast(`You're enrolled in ${course.title}`);
    } catch (error) { setToast(error.message); }
    setTimeout(() => setToast(""), 2800);
  };

  return (
    <DashboardShell title="Discover your next skill." subtitle="Courses built for where the world is going.">
      {toast && <div className="toast"><Check size={17} /> {toast}</div>}
      <div className="explore-toolbar">
        <div className="search-box"><Search size={18} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search courses, skills, or topics" /></div>
        <div className="category-tabs">{categories.map((item) => <button className={category === item ? "active" : ""} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div>
      </div>
      <div className="results-line"><strong>{filtered.length} courses</strong><span>Curated by industry practitioners</span></div>
      <div className="course-grid explore-grid">{filtered.map((course) => <CourseCard key={course._id} course={course} onEnroll={enroll} />)}</div>
    </DashboardShell>
  );
}

function CourseDetail() {
  const { slug } = useParams();
  const [course, setCourse] = useState(demoCourses.find((item) => item.slug === slug));
  useEffect(() => { api(`/courses/${slug}`).then((data) => setCourse(data.course)).catch(() => {}); }, [slug]);
  if (!course) return <Navigate to="/explore" replace />;
  return (
    <DashboardShell title={course.title} subtitle={`with ${course.instructor}`}>
      <div className="course-detail">
        <div className="course-hero" style={{ "--course-color": course.color }}>
          <div><span className="detail-badge">{course.category}</span><h2>{course.description}</h2><div className="detail-meta"><span><Star size={16} fill="currentColor" /> {course.rating}</span><span><Users size={16} /> {formatStudents(course.studentCount)} learners</span><span><Clock3 size={16} /> {course.duration}</span></div><button className="button button-light">Continue course <CirclePlay size={17} /></button></div>
          <CourseArt course={course} />
        </div>
        <div className="detail-layout">
          <section><span className="kicker">COURSE CURRICULUM</span><h2>What you'll learn</h2><div className="lesson-list">{course.lessons?.map((lesson, index) => <div key={lesson.title}><span className="lesson-number">{String(index + 1).padStart(2, "0")}</span><span className="lesson-play"><CirclePlay size={18} /></span><div><strong>{lesson.title}</strong><small>{lesson.type} · {lesson.duration}</small></div><Check size={17} className={index === 0 ? "complete" : ""} /></div>)}</div></section>
          <aside className="skills-panel"><span className="kicker">SKILLS YOU'LL BUILD</span>{course.skills?.map((skill) => <span key={skill}><Check size={15} />{skill}</span>)}<hr /><p>Learn at your own pace with lifetime access and an AI coach available in every lesson.</p></aside>
        </div>
      </div>
    </DashboardShell>
  );
}

function AdminDashboard() {
  const [data, setData] = useState({ stats: { students: 1248, courses: 24, published: 20, enrollments: 3680 }, recentCourses: demoCourses });
  useEffect(() => { if (!localStorage.getItem("novalearn_demo")) api("/dashboard/admin").then(setData).catch(() => {}); }, []);
  return (
    <DashboardShell admin title="Platform overview" subtitle="A clear view of how your learning community is growing." action={<Link className="button button-dark" to="/admin/courses"><Plus size={16} /> New course</Link>}>
      <section className="stats-grid admin-stats">
        <StatCard icon={Users} label="TOTAL STUDENTS" value={data.stats.students.toLocaleString()} note="+12.4% this month" color="#7258df" />
        <StatCard icon={Library} label="TOTAL COURSES" value={data.stats.courses} note={`${data.stats.published} published`} color="#008d7b" />
        <StatCard icon={GraduationCap} label="ENROLLMENTS" value={data.stats.enrollments.toLocaleString()} note="+284 this month" color="#dc7430" />
        <StatCard icon={TrendingUp} label="COMPLETION RATE" value="78%" note="+3.2% this month" color="#d84f70" />
      </section>
      <section className="admin-chart-row">
        <div className="analytics-card">
          <div className="card-title"><div><span className="kicker">LEARNING ACTIVITY</span><h2>Engagement</h2></div><button>Last 6 months <ChevronDown size={15} /></button></div>
          <div className="line-chart">
            <div className="chart-grid">{[0,1,2,3].map((x) => <i key={x} />)}</div>
            <svg viewBox="0 0 700 210" preserveAspectRatio="none"><defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7357e8" stopOpacity=".28"/><stop offset="100%" stopColor="#7357e8" stopOpacity="0"/></linearGradient></defs><path d="M0 172 C70 160 90 105 150 130 S250 88 315 102 S420 52 475 80 S585 28 700 42 L700 210 L0 210Z" fill="url(#fill)"/><path d="M0 172 C70 160 90 105 150 130 S250 88 315 102 S420 52 475 80 S585 28 700 42" fill="none" stroke="#7357e8" strokeWidth="4"/></svg>
            <div className="chart-labels"><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span></div>
          </div>
        </div>
        <div className="category-card"><span className="kicker">TOP CATEGORIES</span><h2>By enrollment</h2>{[["AI & ML", 82, "#7357e8"],["Development", 67, "#008d7b"],["Design", 48, "#dc7430"],["Data", 34, "#d84f70"]].map(([name,value,color]) => <div className="category-line" key={name}><div><span>{name}</span><strong>{value}%</strong></div><i><b style={{ width: `${value}%`, background: color }} /></i></div>)}</div>
      </section>
      <section className="recent-table"><div className="card-title"><div><span className="kicker">CONTENT LIBRARY</span><h2>Recent courses</h2></div><Link to="/admin/courses">Manage all <ArrowRight size={15} /></Link></div><div className="table-wrap"><table><thead><tr><th>Course</th><th>Category</th><th>Status</th><th>Students</th><th>Rating</th></tr></thead><tbody>{data.recentCourses.map((course) => <tr key={course._id}><td><span className="table-course-icon" style={{ background: course.color }}><BookOpen size={15} /></span><strong>{course.title}</strong></td><td>{course.category}</td><td><span className="status live">Published</span></td><td>{formatStudents(course.studentCount)}</td><td><Star size={14} fill="currentColor" /> {course.rating}</td></tr>)}</tbody></table></div></section>
    </DashboardShell>
  );
}

function CourseModal({ course, close, save }) {
  const [form, setForm] = useState(course || { title: "", description: "", category: "Artificial Intelligence", level: "Beginner", duration: "6 weeks", instructor: "", color: "#7357e8", rating: 4.8, published: true, skills: [] });
  const update = (key, value) => setForm({ ...form, [key]: value });
  return <div className="modal-backdrop"><div className="course-modal"><div className="modal-heading"><div><span className="kicker">{course ? "EDIT COURSE" : "CREATE COURSE"}</span><h2>{course ? "Refine the learning experience" : "Build a new learning path"}</h2></div><button onClick={close}><X /></button></div><form onSubmit={(e) => { e.preventDefault(); save(form); }}>
    <div className="form-grid"><label>Course title<input value={form.title} onChange={(e) => update("title", e.target.value)} required /></label><label>Instructor<input value={form.instructor} onChange={(e) => update("instructor", e.target.value)} required /></label></div>
    <label>Description<textarea value={form.description} onChange={(e) => update("description", e.target.value)} required /></label>
    <div className="form-grid"><label>Category<select value={form.category} onChange={(e) => update("category", e.target.value)}>{categories.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label><label>Level<select value={form.level} onChange={(e) => update("level", e.target.value)}>{["Beginner","Intermediate","Advanced"].map((item) => <option key={item}>{item}</option>)}</select></label></div>
    <div className="form-grid"><label>Duration<input value={form.duration} onChange={(e) => update("duration", e.target.value)} /></label><label>Skills <small>(comma separated)</small><input value={Array.isArray(form.skills) ? form.skills.join(", ") : form.skills} onChange={(e) => update("skills", e.target.value)} /></label></div>
    <label className="toggle-label"><button type="button" className={`toggle ${form.published ? "on" : ""}`} onClick={() => update("published", !form.published)}><i /></button><span><strong>Publish course</strong><small>Make this course visible to learners</small></span></label>
    <div className="modal-actions"><button type="button" className="button button-ghost" onClick={close}>Cancel</button><button className="button button-primary">{course ? "Save changes" : "Create course"} <ArrowRight size={16} /></button></div>
  </form></div></div>;
}

function AdminCourses() {
  const [courses, setCourses] = useState(demoCourses);
  const [editing, setEditing] = useState(undefined);
  const [search, setSearch] = useState("");
  useEffect(() => { if (!localStorage.getItem("novalearn_demo")) api("/courses?all=true").then((data) => setCourses(data.courses)).catch(() => {}); }, []);
  const save = async (form) => {
    const payload = { ...form, skills: Array.isArray(form.skills) ? form.skills : form.skills.split(",").map((skill) => skill.trim()).filter(Boolean) };
    try {
      if (localStorage.getItem("novalearn_demo")) {
        if (editing) setCourses(courses.map((item) => item._id === editing._id ? { ...item, ...payload } : item));
        else setCourses([{ ...payload, _id: `demo-${Date.now()}`, slug: payload.title.toLowerCase().replace(/\s+/g, "-"), studentCount: 0, lessons: [] }, ...courses]);
      } else {
        const data = await api(editing ? `/courses/${editing._id}` : "/courses", { method: editing ? "PUT" : "POST", body: JSON.stringify(payload) });
        setCourses(editing ? courses.map((item) => item._id === editing._id ? data.course : item) : [data.course, ...courses]);
      }
      setEditing(undefined);
    } catch (error) { alert(error.message); }
  };
  const remove = async (course) => {
    if (!confirm(`Delete "${course.title}"?`)) return;
    try {
      if (!localStorage.getItem("novalearn_demo")) await api(`/courses/${course._id}`, { method: "DELETE" });
      setCourses(courses.filter((item) => item._id !== course._id));
    } catch (error) { alert(error.message); }
  };
  const filtered = courses.filter((course) => course.title.toLowerCase().includes(search.toLowerCase()));
  return (
    <DashboardShell admin title="Course management" subtitle="Create, refine, and publish learning experiences." action={<button className="button button-dark" onClick={() => setEditing(null)}><Plus size={16} /> New course</button>}>
      <div className="management-toolbar"><div className="search-box"><Search size={18} /><input placeholder="Search your courses" value={search} onChange={(e) => setSearch(e.target.value)} /></div><span>{courses.length} total courses</span></div>
      <div className="course-grid admin-course-grid">{filtered.map((course) => <CourseCard key={course._id} course={course} admin onEdit={setEditing} onDelete={remove} />)}</div>
      {editing !== undefined && <CourseModal course={editing} close={() => setEditing(undefined)} save={save} />}
    </DashboardShell>
  );
}

function App() {
  return <AuthProvider><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<AuthPage mode="login" />} />
    <Route path="/register" element={<AuthPage mode="register" />} />
    <Route path="/dashboard" element={<Protected role="student"><StudentDashboard /></Protected>} />
    <Route path="/explore" element={<Protected role="student"><Explore /></Protected>} />
    <Route path="/courses/:slug" element={<Protected><CourseDetail /></Protected>} />
    <Route path="/admin" element={<Protected role="admin"><AdminDashboard /></Protected>} />
    <Route path="/admin/courses" element={<Protected role="admin"><AdminCourses /></Protected>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></AuthProvider>;
}

export default App;
