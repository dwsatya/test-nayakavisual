import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // --- UPDATE: State Form ditambahkan edited_id ---
  const [userForm, setUserForm] = useState({ username: "", email: "", password: "", role: "user" });
  const [eventForm, setEventForm] = useState({ id: null, nama_events: "", kode_folder: "", edited_id: "" });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    const endpoint = activeTab === "users" ? "http://127.0.0.1:5000/auth/users" : "http://127.0.0.1:5000/events/";
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
      setLoading(false);
    }
  };

  // --- ACTIONS USERS ---
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userForm)
      });
      const data = await response.json();
      if (response.ok) {
        alert("User berhasil ditambahkan!");
        setUserForm({ username: "", email: "", password: "", role: "user" });
        fetchData();
      } else {
        alert("Gagal: " + data.message);
      }
    } catch (err) {
      alert("Terjadi kesalahan koneksi");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Hapus user ini? Akun tidak dapat dikembalikan.")) return;
    await fetch(`http://127.0.0.1:5000/auth/delete/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    fetchData();
  };

  // --- ACTIONS EVENTS (Updated for edited_id) ---
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    const isEdit = eventForm.id !== null;
    const url = isEdit ? `http://127.0.0.1:5000/events/update/${eventForm.id}` : "http://127.0.0.1:5000/events/add";
    
    try {
      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            ...eventForm,
            // Pastikan edited_id dikirim sebagai angka atau null
            edited_id: eventForm.edited_id === "" ? null : parseInt(eventForm.edited_id)
        })
      });

      if (response.ok) {
        alert(isEdit ? "Event diperbarui!" : "Event ditambahkan!");
        setEventForm({ id: null, nama_events: "", kode_folder: "", edited_id: "" });
        fetchData();
      }
    } catch (err) {
      alert("Gagal menyimpan event");
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Hapus event ini?")) return;
    await fetch(`http://127.0.0.1:5000/events/delete/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    fetchData();
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2>Admin Panel - Nayaka Visuals</h2>
        <button onClick={() => { localStorage.clear(); window.location.href="/login"; }} style={styles.logoutBtn}>Logout</button>
      </header>

      <div style={styles.tabContainer}>
        <button style={activeTab === "users" ? styles.tabActive : styles.tab} onClick={() => setActiveTab("users")}>Users & Photos</button>
        <button style={activeTab === "events" ? styles.tabActive : styles.tab} onClick={() => setActiveTab("events")}>Manage Events</button>
      </div>

      <main style={styles.content}>
        {loading ? <p>Loading data...</p> : (
          <>
            {/* TAB USERS */}
            {activeTab === "users" && (
              <div>
                <h4 style={{ marginBottom: '10px' }}>Tambah User Baru</h4>
                <form onSubmit={handleUserSubmit} style={styles.form}>
                  <input placeholder="Username" value={userForm.username} onChange={(e) => setUserForm({...userForm, username: e.target.value})} style={styles.input} required />
                  <input placeholder="Email" type="email" value={userForm.email} onChange={(e) => setUserForm({...userForm, email: e.target.value})} style={styles.input} required />
                  <input placeholder="Password" type="password" value={userForm.password} onChange={(e) => setUserForm({...userForm, password: e.target.value})} style={styles.input} required />
                  <select value={userForm.role} onChange={(e) => setUserForm({...userForm, role: e.target.value})} style={styles.input}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button type="submit" style={styles.saveBtn}>Tambah User</button>
                </form>

                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thr}>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Foto Dipilih</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} style={styles.tr}>
                        <td>{u.id}</td>
                        <td style={{ fontWeight: 'bold' }}>{u.username}</td>
                        <td>{u.email}</td>
                        <td><span style={u.role === 'admin' ? styles.badgeAdmin : styles.badgeUser}>{u.role}</span></td>
                        <td style={{ fontSize: '11px', color: '#666', maxWidth: '200px' }}>{u.foto_yang_dipilih || "-"}</td>
                        <td>
                          <button onClick={() => deleteUser(u.id)} style={styles.delBtn}>Hapus</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB EVENTS */}
            {activeTab === "events" && (
              <div>
                <h4 style={{ marginBottom: '10px' }}>{eventForm.id ? "Edit Event" : "Tambah Event Baru"}</h4>
                <form onSubmit={handleEventSubmit} style={styles.form}>
                  <input placeholder="Nama Event" value={eventForm.nama_events} onChange={(e) => setEventForm({...eventForm, nama_events: e.target.value})} style={styles.input} required />
                  <input placeholder="Kode Folder Drive" value={eventForm.kode_folder} onChange={(e) => setEventForm({...eventForm, kode_folder: e.target.value})} style={styles.input} required />
                  {/* UPDATE: Input untuk Edited ID */}
                  <input placeholder="Client ID (1/2/3)" type="number" value={eventForm.edited_id || ""} onChange={(e) => setEventForm({...eventForm, edited_id: e.target.value})} style={styles.inputSmall} title="Isi 1 untuk Client1, 2 untuk Client2" />
                  
                  <button type="submit" style={styles.saveBtn}>{eventForm.id ? "Update" : "Simpan Event"}</button>
                  {eventForm.id && <button onClick={() => setEventForm({id:null, nama_events:"", kode_folder:"", edited_id: ""})} style={styles.cancelBtn}>Batal</button>}
                </form>

                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thr}>
                      <th>ID</th>
                      <th>Nama Event</th>
                      <th>Kode Folder</th>
                      <th>Client Target (Edited ID)</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map(ev => (
                      <tr key={ev.id} style={styles.tr}>
                        <td>{ev.id}</td>
                        <td style={{ fontWeight: 'bold' }}>{ev.nama_events}</td>
                        <td>{ev.kode_folder}</td>
                        <td>
                            {ev.edited_id ? (
                                <span style={styles.badgeEdited}>Client {ev.edited_id}</span>
                            ) : (
                                <span style={{color: '#ccc'}}>Belum diatur</span>
                            )}
                        </td>
                        <td>
                          <button onClick={() => setEventForm(ev)} style={styles.editBtn}>Edit</button>
                          <button onClick={() => deleteEvent(ev.id)} style={styles.delBtn}>Hapus</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: { padding: "30px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: '#fcfcfc', minHeight: '100vh' },
  header: { display: "flex", justifyContent: "space-between", alignItems: 'center', borderBottom: "3px solid #800000", paddingBottom: "15px" },
  tabContainer: { margin: "25px 0", display: "flex", gap: "10px" },
  tab: { padding: "12px 25px", cursor: "pointer", border: "1px solid #ddd", background: "#fff", borderRadius: '8px', transition: '0.3s' },
  tabActive: { padding: "12px 25px", cursor: "pointer", border: "1px solid #800000", background: "#800000", color: "white", borderRadius: '8px', fontWeight: 'bold' },
  content: { background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' },
  table: { width: "100%", borderCollapse: "collapse", marginTop: "15px" },
  thr: { background: "#f8f9fa", textAlign: "left", padding: '12px', borderBottom: '2px solid #dee2e6' },
  tr: { borderBottom: "1px solid #eee", transition: '0.2s' },
  delBtn: { background: "#dc3545", color: "white", border: "none", padding: "6px 12px", cursor: "pointer", borderRadius: '4px', fontSize: '12px' },
  editBtn: { background: "#ffc107", color: "black", border: "none", padding: "6px 12px", cursor: "pointer", borderRadius: '4px', fontSize: '12px', marginRight: '5px' },
  saveBtn: { background: "#28a745", color: "white", border: "none", padding: "10px 20px", cursor: "pointer", borderRadius: '6px', fontWeight: 'bold' },
  cancelBtn: { background: "#6c757d", color: "white", border: "none", padding: "10px 20px", cursor: "pointer", borderRadius: "6px", marginLeft: "5px" },
  form: { marginBottom: "30px", display: "flex", gap: "12px", flexWrap: 'wrap', alignItems: 'center' },
  input: { padding: "10px", borderRadius: '6px', border: '1px solid #ccc', minWidth: '180px' },
  inputSmall: { padding: "10px", borderRadius: '6px', border: '1px solid #ccc', width: '100px' },
  logoutBtn: { background: "#333", color: "white", padding: "8px 20px", cursor: "pointer", border: 'none', borderRadius: '6px' },
  badgeAdmin: { background: '#ffebee', color: '#c62828', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' },
  badgeUser: { background: '#e3f2fd', color: '#1565c0', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' },
  badgeEdited: { background: '#e8f5e9', color: '#2e7d32', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' },
};