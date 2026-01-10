import { useEffect, useState } from "react";
import { Skeleton, Space, Table, Modal } from "antd";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem("token");

  const [userForm, setUserForm] = useState({ username: "", email: "", password: "", role: "user" });
  const [eventForm, setEventForm] = useState({ id: null, nama_events: "", kode_folder: "", edited_id: "" });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    fetchData();
    return () => window.removeEventListener("resize", handleResize);
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    const endpoint = activeTab === "users" 
      ? "https://famous-michaelina-nayakavisual-62f8d376.koyeb.app/auth/users" 
      : "https://famous-michaelina-nayakavisual-62f8d376.koyeb.app/events/";
    
    try {
      const response = await fetch(endpoint, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (activeTab === "users") setUsers(data);
      else setEvents(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const handleSignOut = () => {
    Modal.confirm({
      title: 'Konfirmasi Keluar',
      content: 'Apakah Anda yakin ingin keluar dari sistem?',
      okText: 'Ya, Keluar',
      okType: 'danger',
      cancelText: 'Batal',
      onOk() {
        localStorage.clear();
        window.location.href = "/login";
      },
    });
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://famous-michaelina-nayakavisual-62f8d376.koyeb.app/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userForm)
      });
      if (response.ok) {
        alert("User berhasil ditambahkan!");
        setUserForm({ username: "", email: "", password: "", role: "user" });
        fetchData();
      }
    } catch (err) { alert("Terjadi kesalahan koneksi"); }
  };

  const deleteUser = async (id) => {
    Modal.confirm({
      title: 'Hapus User',
      content: 'Akun tidak dapat dikembalikan. Lanjutkan?',
      okText: 'Hapus',
      okType: 'danger',
      onOk: async () => {
        await fetch(`https://famous-michaelina-nayakavisual-62f8d376.koyeb.app/auth/delete/${id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        });
        fetchData();
      }
    });
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    const isEdit = eventForm.id !== null;
    const url = isEdit 
      ? `https://famous-michaelina-nayakavisual-62f8d376.koyeb.app/events/update/${eventForm.id}` 
      : "https://famous-michaelina-nayakavisual-62f8d376.koyeb.app/events/add";
    
    try {
      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            ...eventForm,
            edited_id: eventForm.edited_id === "" ? null : parseInt(eventForm.edited_id)
        })
      });
      if (response.ok) {
        setEventForm({ id: null, nama_events: "", kode_folder: "", edited_id: "" });
        fetchData();
      }
    } catch (err) { alert("Gagal menyimpan event"); }
  };

  const deleteEvent = async (id) => {
    Modal.confirm({
      title: 'Hapus Event',
      content: 'Yakin ingin menghapus event ini?',
      onOk: async () => {
        await fetch(`https://famous-michaelina-nayakavisual-62f8d376.koyeb.app/events/delete/${id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        });
        fetchData();
      }
    });
  };

  return (
    <div style={styles.layout}>
      {/* MOBILE HEADER */}
      {isMobile && (
        <div style={styles.mobileHeader}>
          <h2 style={{...styles.logoText, fontSize: '14px'}}>NAYAKA<span style={{color:'#800000'}}>VISUALS</span></h2>
          <button onClick={() => setMenuOpen(!menuOpen)} style={styles.menuToggle}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      )}

      {/* SIDEBAR */}
      <aside style={{
        ...styles.sidebar,
        transform: isMobile ? (menuOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
        transition: 'transform 0.3s ease-in-out',
        paddingTop: isMobile ? '80px' : '0'
      }}>
        <div style={styles.logoArea}>
          <h2 style={styles.logoText}>NAYAKA<span>VISUALS</span></h2>
          <p style={styles.logoSub}>ADMINISTRATOR</p>
        </div>
        
        <nav style={styles.nav}>
          <button style={activeTab === "users" ? styles.navItemActive : styles.navItem} onClick={() => { setActiveTab("users"); if(isMobile) setMenuOpen(false); }}>
            <span style={styles.navDot}></span> USERS & PHOTOS
          </button>
          <button style={activeTab === "events" ? styles.navItemActive : styles.navItem} onClick={() => { setActiveTab("events"); if(isMobile) setMenuOpen(false); }}>
            <span style={styles.navDot}></span> MANAGE EVENTS
          </button>
          <button style={activeTab === "job" ? styles.navItemActive : styles.navItem} onClick={() => { setActiveTab("job"); if(isMobile) setMenuOpen(false); }}>
            <span style={styles.navDot}></span> CLIENT JOBS
          </button>
        </nav>

        <div style={styles.sidebarFooter}>
          <button onClick={handleSignOut} style={styles.logoutBtnSide}>SIGN OUT</button>
        </div>
      </aside>

      {/* OVERLAY */}
      {isMobile && menuOpen && <div onClick={() => setMenuOpen(false)} style={styles.overlay} />}

      {/* MAIN CONTENT */}
      <main style={{
        ...styles.main,
        marginLeft: isMobile ? '0' : '240px',
        padding: isMobile ? '15px' : '40px',
        marginTop: isMobile ? '60px' : '0'
      }}>
        <header style={styles.topBar}>
          <h3 style={{...styles.pageTitle, fontSize: isMobile ? '18px' : '22px'}}>
            {activeTab === "users" ? "User Management" : activeTab === "events" ? "Event Management" : "Client Job List"}
          </h3>
          <div style={styles.adminProfile}>{isMobile ? "v1.1" : "Admin Panel v1.1"}</div>
        </header>

        <section style={{...styles.contentCard, padding: isMobile ? '20px' : '30px'}}>
          {loading ? (
            <div style={{ padding: '20px' }}><Skeleton active paragraph={{ rows: 8 }} /></div>
          ) : (
            <>
              {activeTab === "users" && (
                <div>
                  <h4 style={styles.sectionTitle}>Add New User</h4>
                  <form onSubmit={handleUserSubmit} style={styles.formGrid}>
                    <input placeholder="Username" value={userForm.username} onChange={(e) => setUserForm({...userForm, username: e.target.value})} style={styles.inputMobileFull} required />
                    <input placeholder="Email" type="email" value={userForm.email} onChange={(e) => setUserForm({...userForm, email: e.target.value})} style={styles.inputMobileFull} required />
                    <div style={{display: 'flex', gap: '10px', width: '100%', flexWrap: isMobile ? 'wrap' : 'nowrap'}}>
                        <input placeholder="Password" type="password" value={userForm.password} onChange={(e) => setUserForm({...userForm, password: e.target.value})} style={styles.inputMobileFull} required />
                        <select value={userForm.role} onChange={(e) => setUserForm({...userForm, role: e.target.value})} style={{...styles.select, width: isMobile ? '100%' : 'auto'}}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" style={{...styles.addBtn, width: '100%', marginTop: '5px'}}>+ Add User</button>
                  </form>

                  <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={{width: '40px'}}>ID</th>
                          <th>User Info</th>
                          <th style={{textAlign: 'right'}}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u.id}>
                            <td style={{verticalAlign: 'top', paddingTop: '12px'}}>#{u.id}</td>
                            <td>
                              <div style={{fontWeight: '700', color: '#111', fontSize: '14px'}}>{u.username}</div>
                              <div style={{fontSize: '12px', color: '#666', marginBottom: '4px'}}>{u.email}</div>
                              <span style={u.role === 'admin' ? styles.badgeAdmin : styles.badgeUser}>{u.role}</span>
                            </td>
                            <td style={{textAlign: 'right', verticalAlign: 'top', paddingTop: '12px'}}>
                              <button onClick={() => deleteUser(u.id)} style={styles.delBtn}>Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "events" && (
                <div>
                  <h4 style={styles.sectionTitle}>{eventForm.id ? "Update Event" : "Create Event"}</h4>
                  <form onSubmit={handleEventSubmit} style={styles.formGrid}>
                    <input placeholder="Event Name" value={eventForm.nama_events} onChange={(e) => setEventForm({...eventForm, nama_events: e.target.value})} style={styles.inputMobileFull} required />
                    <input placeholder="Drive Folder ID" value={eventForm.kode_folder} onChange={(e) => setEventForm({...eventForm, kode_folder: e.target.value})} style={styles.inputMobileFull} required />
                    <div style={{display: 'flex', gap: '10px', width: '100%'}}>
                        <input placeholder="Client ID" type="number" value={eventForm.edited_id || ""} onChange={(e) => setEventForm({...eventForm, edited_id: e.target.value})} style={styles.inputMobileFull} />
                        <button type="submit" style={{...styles.saveBtn, flex: 2}}>{eventForm.id ? "Update" : "Save Event"}</button>
                    </div>
                    {eventForm.id && <button onClick={() => setEventForm({id:null, nama_events:"", kode_folder:"", edited_id: ""})} style={{...styles.cancelBtn, width: '100%'}}>Cancel</button>}
                  </form>

                  <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={{width: '30px'}}>ID</th>
                          <th>Event & Target</th>
                          <th style={{textAlign: 'right'}}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {events.map(ev => (
                          <tr key={ev.id}>
                            <td style={{verticalAlign: 'top'}}>#{ev.id}</td>
                            <td>
                              <div style={{ fontWeight: '700', color: '#333' }}>{ev.nama_events}</div>
                              <div style={{fontSize: '11px', color: '#999', marginBottom: '5px', wordBreak: 'break-all'}}>{ev.kode_folder}</div>
                              {ev.edited_id ? <span style={styles.badgeEdited}>Target: Client {ev.edited_id}</span> : <span style={{fontSize: '10px', color: '#ccc'}}>No Target</span>}
                            </td>
                            <td style={{textAlign: 'right', verticalAlign: 'top'}}>
                              <div style={{display: 'flex', gap: '8px', justifyContent: 'flex-end'}}>
                                <button onClick={() => setEventForm(ev)} style={styles.editBtn}>Edit</button>
                                <button onClick={() => deleteEvent(ev.id)} style={styles.delBtn}>Del</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "job" && (
                <div>
                  <h4 style={styles.sectionTitle}>Active Client Jobs</h4>
                  <div style={styles.jobGrid}>
                    {Array.from({ length: 16 }, (_, i) => {
                      const eventData = events[i];
                      const clientId = i + 1;
                      return (
                        <div key={clientId} style={styles.jobCard}>
                          <div style={styles.jobCardHeader}>
                            <span style={styles.jobIdBadge}>CLIENT #{clientId}</span>
                            <div style={{ ...styles.jobStatusDot, background: eventData ? '#52c41a' : '#d9d9d9' }}></div>
                          </div>
                          <h5 style={styles.jobTitle}>{eventData ? eventData.nama_events : "Empty Slot"}</h5>
                          <p style={styles.jobText}>{eventData ? `Folder: ${eventData.kode_folder.substring(0, 15)}...` : "No event assigned."}</p>
                          <button style={{ ...styles.jobActionBtn, background: eventData ? '#111' : '#ccc' }} onClick={() => { if(eventData) window.location.href = `/client${clientId}`; }} disabled={!eventData}>
                            {eventData ? "View Page →" : "Locked"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}

const styles = {
  layout: { display: 'flex', minHeight: '100vh', background: '#f4f7f6', fontFamily: "'Inter', sans-serif" },
  mobileHeader: { position: 'fixed', top: 0, left: 0, right: 0, height: '60px', background: '#111', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', zIndex: 110 },
  menuToggle: { background: 'transparent', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90 },
  sidebar: { width: '240px', background: '#111111', color: 'white', display: 'flex', flexDirection: 'column', padding: '0 20px', position: 'fixed', height: '100vh', zIndex: 100 },
  logoArea: { padding: '40px 0', marginBottom: '20px', textAlign: 'center', borderBottom: '1px solid #222' },
  logoText: { fontSize: '18px', letterSpacing: '2px', margin: 0, fontWeight: '800' },
  logoSub: { fontSize: '10px', color: '#666', margin: '8px 0 0 0', letterSpacing: '3px', fontWeight: 'bold' },
  nav: { flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' },
  navItem: { display: 'flex', alignItems: 'center', padding: '14px 15px', background: 'transparent', border: 'none', color: '#888', textAlign: 'left', cursor: 'pointer', borderRadius: '8px', fontSize: '11px', fontWeight: '600' },
  navItemActive: { display: 'flex', alignItems: 'center', padding: '14px 15px', background: '#800000', border: 'none', color: 'white', textAlign: 'left', cursor: 'pointer', borderRadius: '8px', fontWeight: '700', fontSize: '11px' },
  navDot: { width: '6px', height: '6px', background: 'currentColor', borderRadius: '50%', marginRight: '12px' },
  sidebarFooter: { padding: '20px 0', borderTop: '1px solid #222' },
  logoutBtnSide: { width: '100%', padding: '12px', background: 'transparent', color: '#ff4d4f', border: '1px solid #331111', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' },
  main: { flex: 1, transition: 'margin 0.3s' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  pageTitle: { margin: 0, color: '#1a1a1a', fontWeight: '700' },
  adminProfile: { background: '#fff', padding: '6px 12px', borderRadius: '20px', fontSize: '11px', color: '#666', border: '1px solid #eee' },
  contentCard: { background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' },
  sectionTitle: { margin: '0 0 15px 0', color: '#333', fontSize: '15px', fontWeight: '600' },
  
  // FORM STYLES REVISED
  formGrid: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px', background: '#fafafa', padding: '15px', borderRadius: '12px' },
  inputMobileFull: { padding: '12px 15px', borderRadius: '8px', border: '1px solid #ddd', width: '100%', fontSize: '14px', boxSizing: 'border-box' },
  select: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', fontSize: '14px' },
  
  addBtn: { background: '#800000', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' },
  saveBtn: { background: '#2e7d32', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' },
  cancelBtn: { background: '#f0f0f0', color: '#666', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer' },
  
  tableWrapper: { width: '100%', overflowX: 'hidden' }, // Mencegah horizontal scroll yang tak diinginkan
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  
  badgeAdmin: { background: '#fff1f0', color: '#cf1322', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', border: '1px solid #ffa39e' },
  badgeUser: { background: '#e6f7ff', color: '#096dd9', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', border: '1px solid #91d5ff' },
  badgeEdited: { background: '#f6ffed', color: '#389e0d', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', border: '1px solid #b7eb8f' },
  
  delBtn: { background: 'transparent', color: '#ff4d4f', border: '1px solid #ff4d4f', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' },
  editBtn: { background: 'transparent', color: '#faad14', border: '1px solid #faad14', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' },

  jobGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px' },
  jobCard: { background: '#fff', border: '1px solid #f0f0f0', padding: '15px', borderRadius: '12px', display: 'flex', flexDirection: 'column' },
  jobCardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  jobIdBadge: { fontSize: '8px', color: '#999', background: '#f8f8f8', padding: '2px 6px', borderRadius: '4px' },
  jobStatusDot: { width: '6px', height: '6px', borderRadius: '50%' },
  jobTitle: { margin: '0 0 5px 0', fontSize: '13px', fontWeight: '700' },
  jobText: { fontSize: '11px', color: '#777', flex: 1, marginBottom: '10px' },
  jobActionBtn: { color: 'white', border: 'none', padding: '8px', borderRadius: '6px', fontSize: '10px', fontWeight: '600' }
};