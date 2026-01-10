import { useEffect, useState } from "react";
import { Skeleton, Space, Table, Modal } from "antd";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // State deteksi mobile
  const [menuOpen, setMenuOpen] = useState(false); // State sidebar mobile
  const token = localStorage.getItem("token");

  // State Form
  const [userForm, setUserForm] = useState({ username: "", email: "", password: "", role: "user" });
  const [eventForm, setEventForm] = useState({ id: null, nama_events: "", kode_folder: "", edited_id: "" });

  useEffect(() => {
    // Handler untuk resize window
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
      
      if (activeTab === "users") {
        setUsers(data);
      } else {
        setEvents(data);
      }
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
      {/* MOBILE HEADER (Only Visible on Mobile) */}
      {isMobile && (
        <div style={styles.mobileHeader}>
          <h2 style={{...styles.logoText, fontSize: '14px'}}>NAYAKA<span style={{color:'#800000'}}>VISUALS</span></h2>
          <button onClick={() => setMenuOpen(!menuOpen)} style={styles.menuToggle}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      )}

      {/* SIDEBAR (Responsive behavior added) */}
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
          <button 
            style={activeTab === "users" ? styles.navItemActive : styles.navItem} 
            onClick={() => { setActiveTab("users"); if(isMobile) setMenuOpen(false); }}
          >
            <span style={styles.navDot}></span> USERS & PHOTOS
          </button>
          
          <button 
            style={activeTab === "events" ? styles.navItemActive : styles.navItem} 
            onClick={() => { setActiveTab("events"); if(isMobile) setMenuOpen(false); }}
          >
            <span style={styles.navDot}></span> MANAGE EVENTS
          </button>

          <button 
            style={activeTab === "job" ? styles.navItemActive : styles.navItem} 
            onClick={() => { setActiveTab("job"); if(isMobile) setMenuOpen(false); }}
          >
            <span style={styles.navDot}></span> CLIENT JOBS
          </button>
        </nav>

        <div style={styles.sidebarFooter}>
          <button onClick={handleSignOut} style={styles.logoutBtnSide}>
            SIGN OUT
          </button>
        </div>
      </aside>

      {/* OVERLAY FOR MOBILE */}
      {isMobile && menuOpen && <div onClick={() => setMenuOpen(false)} style={styles.overlay} />}

      {/* MAIN CONTENT */}
      <main style={{
        ...styles.main,
        marginLeft: isMobile ? '0' : '240px',
        padding: isMobile ? '20px' : '40px',
        marginTop: isMobile ? '60px' : '0'
      }}>
        <header style={styles.topBar}>
          <h3 style={{...styles.pageTitle, fontSize: isMobile ? '18px' : '22px'}}>
            {activeTab === "users" ? "User Management" : activeTab === "events" ? "Event Management" : "Client Job List"}
          </h3>
          <div style={styles.adminProfile}>{isMobile ? "v1.1" : "Admin Panel v1.1"}</div>
        </header>

        <section style={{...styles.contentCard, padding: isMobile ? '15px' : '30px'}}>
          {loading ? (
            <div style={{ padding: '20px' }}>
              <Skeleton active paragraph={{ rows: 8 }} />
            </div>
          ) : (
            <>
              {activeTab === "users" && (
                <div>
                  <h4 style={styles.sectionTitle}>Add New User</h4>
                  <form onSubmit={handleUserSubmit} style={styles.formGrid}>
                    <input placeholder="Username" value={userForm.username} onChange={(e) => setUserForm({...userForm, username: e.target.value})} style={styles.input} required />
                    <input placeholder="Email" type="email" value={userForm.email} onChange={(e) => setUserForm({...userForm, email: e.target.value})} style={styles.input} required />
                    <input placeholder="Password" type="password" value={userForm.password} onChange={(e) => setUserForm({...userForm, password: e.target.value})} style={styles.input} required />
                    <select value={userForm.role} onChange={(e) => setUserForm({...userForm, role: e.target.value})} style={styles.select}>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button type="submit" style={{...styles.addBtn, width: isMobile ? '100%' : 'auto'}}>+ Add User</button>
                  </form>

                  <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>User Info</th>
                          {!isMobile && <th>Role</th>}
                          {!isMobile && <th>Selected Photos</th>}
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u.id}>
                            <td>#{u.id}</td>
                            <td>
                              <div style={{fontWeight: '600', color: '#333'}}>{u.username}</div>
                              <div style={{fontSize: '11px', color: '#888'}}>{u.email}</div>
                              {isMobile && <span style={u.role === 'admin' ? styles.badgeAdmin : styles.badgeUser}>{u.role}</span>}
                            </td>
                            {!isMobile && <td><span style={u.role === 'admin' ? styles.badgeAdmin : styles.badgeUser}>{u.role}</span></td>}
                            {!isMobile && <td style={styles.photoCell}>{u.foto_yang_dipilih || "-"}</td>}
                            <td>
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
                    <input placeholder="Event Name" value={eventForm.nama_events} onChange={(e) => setEventForm({...eventForm, nama_events: e.target.value})} style={styles.input} required />
                    <input placeholder="Drive Folder ID" value={eventForm.kode_folder} onChange={(e) => setEventForm({...eventForm, kode_folder: e.target.value})} style={styles.input} required />
                    <input placeholder="Client ID" type="number" value={eventForm.edited_id || ""} onChange={(e) => setEventForm({...eventForm, edited_id: e.target.value})} style={isMobile ? styles.input : styles.inputSmall} />
                    <button type="submit" style={{...styles.saveBtn, width: isMobile ? '100%' : 'auto'}}>{eventForm.id ? "Update" : "Save Event"}</button>
                    {eventForm.id && <button onClick={() => setEventForm({id:null, nama_events:"", kode_folder:"", edited_id: ""})} style={{...styles.cancelBtn, width: isMobile ? '100%' : 'auto'}}>Cancel</button>}
                  </form>

                  <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Event Name</th>
                          {!isMobile && <th>Folder Code</th>}
                          <th>Target</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {events.map(ev => (
                          <tr key={ev.id}>
                            <td>{ev.id}</td>
                            <td style={{ fontWeight: '600', color: '#333' }}>
                              {ev.nama_events}
                              {isMobile && <div style={{fontSize: '10px', color: '#999', fontWeight: 'normal'}}>{ev.kode_folder.substring(0, 10)}...</div>}
                            </td>
                            {!isMobile && <td style={{fontFamily: 'monospace', fontSize: '12px', color: '#666'}}>{ev.kode_folder}</td>}
                            <td>{ev.edited_id ? <span style={styles.badgeEdited}>C-{ev.edited_id}</span> : <span style={{color:'#ccc'}}>None</span>}</td>
                            <td>
                              <div style={{display: 'flex', gap: '5px'}}>
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
                  <div style={{
                    ...styles.jobGrid,
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(220px, 1fr))'
                  }}>
                    {Array.from({ length: 16 }, (_, i) => {
                      const eventData = events[i];
                      const clientId = i + 1;

                      return (
                        <div key={clientId} style={styles.jobCard}>
                          <div style={styles.jobCardHeader}>
                            <span style={styles.jobIdBadge}>CLIENT #{clientId}</span>
                            <div style={{
                              ...styles.jobStatusDot, 
                              background: eventData ? '#52c41a' : '#d9d9d9' 
                            }}></div>
                          </div>
                          <h5 style={styles.jobTitle}>{eventData ? eventData.nama_events : "Empty Slot"}</h5>
                          <p style={styles.jobText}>
                            {eventData ? `Project folder: ${eventData.kode_folder.substring(0, 15)}...` : "No event assigned to this client slot yet."}
                          </p>
                          <button 
                            style={{
                              ...styles.jobActionBtn,
                              background: eventData ? '#111' : '#ccc',
                              cursor: eventData ? 'pointer' : 'not-allowed'
                            }}
                            onClick={() => { if(eventData) window.location.href = `/client${clientId}`; }}
                            disabled={!eventData}
                          >
                            {eventData ? "View Client Page →" : "Locked"}
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

// --- STYLES REVISED FOR RESPONSIVENESS ---
const styles = {
  layout: { display: 'flex', minHeight: '100vh', background: '#f4f7f6', fontFamily: "'Inter', sans-serif" },
  
  // Mobile Header
  mobileHeader: { position: 'fixed', top: 0, left: 0, right: 0, height: '60px', background: '#111', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', zIndex: 110 },
  menuToggle: { background: 'transparent', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90 },

  sidebar: { width: '240px', background: '#111111', color: 'white', display: 'flex', flexDirection: 'column', padding: '0 20px', position: 'fixed', height: '100vh', zIndex: 100 },
  logoArea: { padding: '40px 0', marginBottom: '20px', textAlign: 'center', borderBottom: '1px solid #222' },
  logoText: { fontSize: '18px', letterSpacing: '2px', margin: 0, fontWeight: '800' },
  logoSub: { fontSize: '10px', color: '#666', margin: '8px 0 0 0', letterSpacing: '3px', fontWeight: 'bold' },
  nav: { flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' },
  navItem: { display: 'flex', alignItems: 'center', padding: '14px 15px', background: 'transparent', border: 'none', color: '#888', textAlign: 'left', cursor: 'pointer', borderRadius: '8px', fontSize: '11px', fontWeight: '600', letterSpacing: '1px' },
  navItemActive: { display: 'flex', alignItems: 'center', padding: '14px 15px', background: '#800000', border: 'none', color: 'white', textAlign: 'left', cursor: 'pointer', borderRadius: '8px', fontWeight: '700', fontSize: '11px', letterSpacing: '1px', boxShadow: '0 4px 12px rgba(128, 0, 0, 0.3)' },
  navDot: { width: '6px', height: '6px', background: 'currentColor', borderRadius: '50%', marginRight: '12px' },
  sidebarFooter: { padding: '20px 0', borderTop: '1px solid #222' },
  logoutBtnSide: { width: '100%', padding: '12px', background: 'transparent', color: '#ff4d4f', border: '1px solid #331111', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' },
  
  main: { flex: 1, transition: 'margin 0.3s' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
  pageTitle: { margin: 0, color: '#1a1a1a', fontWeight: '700' },
  adminProfile: { background: '#fff', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', color: '#666', border: '1px solid #eee' },
  contentCard: { background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' },
  sectionTitle: { margin: '0 0 20px 0', color: '#333', fontSize: '16px', fontWeight: '600' },
  formGrid: { display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '35px', background: '#fafafa', padding: '20px', borderRadius: '12px' },
  input: { padding: '10px 15px', borderRadius: '8px', border: '1px solid #ddd', flex: '1 1 200px', fontSize: '13px' },
  inputSmall: { padding: '10px 15px', borderRadius: '8px', border: '1px solid #ddd', width: '90px' },
  select: { padding: '10px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', flex: '1 1 100px' },
  addBtn: { background: '#800000', color: 'white', border: 'none', padding: '10px 22px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  saveBtn: { background: '#2e7d32', color: 'white', border: 'none', padding: '10px 22px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  cancelBtn: { background: '#f5f5f5', color: '#666', border: 'none', padding: '10px 22px', borderRadius: '8px', cursor: 'pointer' },
  
  tableWrapper: { overflowX: 'auto', WebkitOverflowScrolling: 'touch' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '400px' },
  photoCell: { fontSize: '11px', color: '#888', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  badgeAdmin: { background: '#fff1f0', color: '#cf1322', padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', border: '1px solid #ffa39e' },
  badgeUser: { background: '#e6f7ff', color: '#096dd9', padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', border: '1px solid #91d5ff' },
  badgeEdited: { background: '#f6ffed', color: '#389e0d', padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', border: '1px solid #b7eb8f' },
  delBtn: { background: 'transparent', color: '#ff4d4f', border: '1px solid #ff4d4f', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '10px' },
  editBtn: { background: 'transparent', color: '#faad14', border: '1px solid #faad14', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '10px' },

  jobGrid: { display: 'grid', gap: '20px' },
  jobCard: { background: '#fff', border: '1px solid #f0f0f0', padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' },
  jobCardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  jobIdBadge: { fontSize: '9px', fontWeight: '800', color: '#999', background: '#f8f8f8', padding: '2px 8px', borderRadius: '4px', border: '1px solid #eee' },
  jobStatusDot: { width: '7px', height: '7px', borderRadius: '50%' },
  jobTitle: { margin: '0 0 10px 0', fontSize: '14px', color: '#222', fontWeight: '700', minHeight: '34px' },
  jobText: { fontSize: '12px', color: '#777', lineHeight: '1.5', marginBottom: '20px', flex: 1 },
  jobActionBtn: { color: 'white', border: 'none', padding: '10px', borderRadius: '8px', fontSize: '11px', fontWeight: '600', transition: 'all 0.3s ease' }
};