import React, { useState } from 'react';
import './App.css';
import { auth, provider, db } from "./firebaseConfig";
import { signInWithPopup, signOut } from "firebase/auth";
import { collection, getDocs, orderBy, query, addDoc, doc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";




function App() {
  const [user, setUser] = useState(auth.currentUser);
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [changelog, setChangelog] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingChangelog, setLoadingChangelog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<'discussions' | 'activityLogs' | 'categories'>('discussions');
  // Form states for CRUD
  const [form, setForm] = useState<any>({});
  const [editId, setEditId] = useState<string | null>(null);
  // --- Changelog CRUD Handlers ---
  const fetchChangelog = async () => {
    setError(null);
    if (!user) return;
    setLoadingChangelog(true);
    try {
      const q = query(collection(db, `Users/${user.uid}/Changelog`), orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      setChangelog(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (err: any) {
      setError(err.message);
    }
    setLoadingChangelog(false);
  };

  const handleCreateChangelog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const data = {
      description: form.description || '',
      timestamp: new Date(),
      uid: user.uid,
    };
    await addDoc(collection(db, `Users/${user.uid}/Changelog`), data);
    setForm({});
    fetchChangelog();
  };

  const handleUpdateChangelog = async (id: string) => {
    if (!user) return;
    const ref = doc(db, `Users/${user.uid}/Changelog`, id);
    await updateDoc(ref, { description: form.description });
    setEditId(null);
    setForm({});
    fetchChangelog();
  };

  const handleDeleteChangelog = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, `Users/${user.uid}/Changelog`, id));
    fetchChangelog();
  };
  // --- CRUD Handlers ---
  // Discussions
  const handleCreateDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const data = {
      description: form.description || '',
      timestamp: new Date(),
      typeSay: form.typeSay || '',
      cleared: false,
      uid: user.uid,
    };
    await addDoc(collection(db, `Users/${user.uid}/Discussion`), data);
    setForm({});
    fetchDiscussions();
  };
  const handleUpdateDiscussion = async (id: string) => {
    if (!user) return;
    const ref = doc(db, `Users/${user.uid}/Discussion`, id);
    await updateDoc(ref, {
      description: form.description,
      typeSay: form.typeSay,
    });
    setEditId(null);
    setForm({});
    fetchDiscussions();
  };
  const handleDeleteDiscussion = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, `Users/${user.uid}/Discussion`, id));
    fetchDiscussions();
  };

  // Activity Logs
  const handleCreateActivityLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const data = {
      description: form.description || '',
      category: form.category || '',
      timestamp: new Date(),
      uid: user.uid,
    };
    await addDoc(collection(db, `Users/${user.uid}/ActivityLog`), data);
    setForm({});
    fetchActivityLogs();
  };
  const handleUpdateActivityLog = async (id: string) => {
    if (!user) return;
    const ref = doc(db, `Users/${user.uid}/ActivityLog`, id);
    await updateDoc(ref, {
      description: form.description,
      category: form.category,
    });
    setEditId(null);
    setForm({});
    fetchActivityLogs();
  };
  const handleDeleteActivityLog = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, `Users/${user.uid}/ActivityLog`, id));
    fetchActivityLogs();
  };

  // Categories
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const data = {
      name: form.name || '',
      description: form.description || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      synced: true,
      uid: user.uid,
    };
    await addDoc(collection(db, `Users/${user.uid}/Category`), data);
    setForm({});
    fetchCategories();
  };
  const handleUpdateCategory = async (id: string) => {
    if (!user) return;
    const ref = doc(db, `Users/${user.uid}/Category`, id);
    await updateDoc(ref, {
      name: form.name,
      description: form.description,
      updatedAt: new Date(),
    });
    setEditId(null);
    setForm({});
    fetchCategories();
  };
  const handleDeleteCategory = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, `Users/${user.uid}/Category`, id));
    fetchCategories();
  };

  auth.onAuthStateChanged((u) => setUser(u));

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setDiscussions([]);
    setActivityLogs([]);
    setCategories([]);
  };

  const fetchDiscussions = async () => {
    setError(null);
    if (!user) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, `Users/${user.uid}/Discussion`),
        orderBy("timestamp", "desc")
      );
      const snapshot = await getDocs(q);
      setDiscussions(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const fetchActivityLogs = async () => {
    setError(null);
    if (!user) return;
    setLoadingActivity(true);
    try {
      const q = query(
        collection(db, `Users/${user.uid}/ActivityLog`),
        orderBy("timestamp", "desc")
      );
      const snapshot = await getDocs(q);
      setActivityLogs(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (err: any) {
      setError(err.message);
    }
    setLoadingActivity(false);
  };

  const fetchCategories = async () => {
    setError(null);
    if (!user) return;
    setLoadingCategories(true);
    try {
      const q = query(collection(db, `Users/${user.uid}/Category`));
      const snapshot = await getDocs(q);
      setCategories(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (err: any) {
      setError(err.message);
    }
    setLoadingCategories(false);
  };

  return (
    <div className="App" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #181c24 0%, #23283a 100%)', color: '#fff', fontFamily: 'Segoe UI, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: 0, margin: 0, boxShadow: '0 2px 12px 0 #0004', background: 'rgba(35,40,58,0.98)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', background: 'transparent', padding: '18px 40px', borderBottom: '1px solid #222', minHeight: 72 }}>
          <div style={{ fontWeight: 900, fontSize: 32, letterSpacing: 2, color: '#4fd1c5', textShadow: '0 2px 12px #2228' }}>
            <span style={{ fontFamily: 'Montserrat, Segoe UI, sans-serif', textTransform: 'uppercase', letterSpacing: 4 }}>life</span><span style={{ color: '#fff', fontWeight: 700 }}>Log</span>
          </div>
          <div style={{ flex: 1 }} />
          {!user ? (
            <button onClick={handleSignIn} style={{ background: 'linear-gradient(90deg, #4fd1c5 60%, #38b2ac 100%)', color: '#181c24', border: 'none', borderRadius: 24, padding: '10px 32px', fontWeight: 700, fontSize: 18, cursor: 'pointer', boxShadow: '0 2px 8px #4fd1c555', transition: 'all 0.2s' }}>Sign in with Google</button>
          ) : (
            <>
              <span style={{ fontSize: 17, color: '#b2f5ea', fontWeight: 500, marginRight: 12, letterSpacing: 0.5 }}>Signed in as: <span style={{ color: '#fff', fontWeight: 700 }}>{user.email}</span></span>
              <button onClick={handleSignOut} style={{ marginLeft: 16, background: 'linear-gradient(90deg, #23283a 60%, #2d3748 100%)', color: '#fff', border: 'none', borderRadius: 24, padding: '10px 28px', fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #2228', transition: 'all 0.2s' }}>Sign Out</button>
            </>
          )}
        </div>
      </header>
      {user && (
        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          {/* Sidebar */}
          <nav style={{ width: 240, background: 'rgba(35,40,58,0.98)', padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'stretch', borderRight: '1px solid #222', boxShadow: '2px 0 16px #0002', gap: 8 }}>
            {[{ key: 'discussions', label: '💬 Discussions', color: '#4fd1c5' }, { key: 'activityLogs', label: '🏃‍♂️ Activity Logs', color: '#63b3ed' }, { key: 'categories', label: '🏷️ Categories', color: '#f6ad55' }].map(tab => (
              <button key={tab.key} onClick={() => {
                setSelectedTable(tab.key as any);
                if (tab.key === 'discussions') fetchDiscussions();
                if (tab.key === 'activityLogs') fetchActivityLogs();
                if (tab.key === 'categories') fetchCategories();
              }}
                style={{
                  background: selectedTable === tab.key ? `linear-gradient(90deg, ${tab.color} 60%, #23283a 100%)` : 'transparent',
                  color: selectedTable === tab.key ? '#181c24' : '#fff',
                  border: 'none',
                  borderRadius: 16,
                  padding: '14px 28px',
                  margin: '0 20px 12px 20px',
                  fontWeight: 700,
                  fontSize: 18,
                  cursor: 'pointer',
                  boxShadow: selectedTable === tab.key ? '0 2px 12px #4fd1c555' : 'none',
                  letterSpacing: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  transition: 'all 0.18s',
                  outline: selectedTable === tab.key ? '2px solid #4fd1c5' : 'none',
                }}
              >{tab.label}</button>
            ))}
          </nav>
          {/* Main Content */}
          <main style={{ flex: 1, padding: '48px 48px 48px 0', overflowY: 'auto', background: 'linear-gradient(120deg, #23283a 60%, #181c24 100%)', borderRadius: 32, margin: 24, boxShadow: '0 4px 32px #0003', minHeight: 0 }}>
            {error && <div style={{ color: 'salmon', marginBottom: 16 }}>{error}</div>}
            {selectedTable === 'discussions' && (
              <>
                <h2 style={{ color: '#4fd1c5', marginBottom: 24 }}>Discussions</h2>
                <form onSubmit={editId ? (e) => { e.preventDefault(); handleUpdateDiscussion(editId); } : handleCreateDiscussion} style={{ marginBottom: 24, display: 'flex', gap: 12, alignItems: 'center' }}>
                  <input placeholder="Description" value={form.description || ''} onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))} style={{ padding: 8, borderRadius: 4, border: '1px solid #444', background: '#23283a', color: '#fff' }} required />
                  <input placeholder="Type" value={form.typeSay || ''} onChange={e => setForm((f: any) => ({ ...f, typeSay: e.target.value }))} style={{ padding: 8, borderRadius: 4, border: '1px solid #444', background: '#23283a', color: '#fff' }} />
                  <button type="submit" style={{ background: '#4fd1c5', color: '#181c24', border: 'none', borderRadius: 4, padding: '8px 20px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>{editId ? 'Update' : 'Add'}</button>
                  {editId && <button type="button" onClick={() => { setEditId(null); setForm({}); }} style={{ background: '#2d3748', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>}
                </form>
                <table style={{ width: '100%', color: 'white', background: '#23283a', borderCollapse: 'collapse', borderRadius: 8, overflow: 'hidden' }}>
                  <thead>
                    <tr style={{ background: '#2d3748' }}>
                      <th style={{ border: '1px solid #444', padding: '12px', textAlign: 'left' }}>Description</th>
                      <th style={{ border: '1px solid #444', padding: '12px' }}>Timestamp</th>
                      <th style={{ border: '1px solid #444', padding: '12px' }}>Type</th>
                      <th style={{ border: '1px solid #444', padding: '12px' }}>Cleared</th>
                      <th style={{ border: '1px solid #444', padding: '12px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {discussions.map((d: any) => (
                      <tr key={d.id}>
                        <td style={{ border: '1px solid #444', padding: '12px', textAlign: 'left' }}>{editId === d.id ? <input value={form.description || ''} onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))} style={{ padding: 6, borderRadius: 4, border: '1px solid #444', background: '#23283a', color: '#fff' }} /> : d.description}</td>
                        <td style={{ border: '1px solid #444', padding: '12px' }}>{d.timestamp?.toDate ? d.timestamp.toDate().toLocaleString() : d.timestamp ? new Date(d.timestamp).toLocaleString() : ""}</td>
                        <td style={{ border: '1px solid #444', padding: '12px' }}>{editId === d.id ? <input value={form.typeSay || ''} onChange={e => setForm((f: any) => ({ ...f, typeSay: e.target.value }))} style={{ padding: 6, borderRadius: 4, border: '1px solid #444', background: '#23283a', color: '#fff' }} /> : d.typeSay}</td>
                        <td style={{ border: '1px solid #444', padding: '12px' }}>{d.cleared ? "Yes" : "No"}</td>
                        <td style={{ border: '1px solid #444', padding: '12px' }}>
                          {editId === d.id ? (
                            <>
                              <button onClick={() => handleUpdateDiscussion(d.id)} style={{ background: '#4fd1c5', color: '#181c24', border: 'none', borderRadius: 4, padding: '6px 12px', fontWeight: 600, marginRight: 6, cursor: 'pointer' }}>Save</button>
                              <button onClick={() => { setEditId(null); setForm({}); }} style={{ background: '#2d3748', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => { setEditId(d.id); setForm({ description: d.description, typeSay: d.typeSay }); }} style={{ background: '#4fd1c5', color: '#181c24', border: 'none', borderRadius: 4, padding: '6px 12px', fontWeight: 600, marginRight: 6, cursor: 'pointer' }}>Edit</button>
                              <button onClick={() => handleDeleteDiscussion(d.id)} style={{ background: '#e53e3e', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {discussions.length === 0 && !error && <div>No discussions found.</div>}
              </>
            )}
            {selectedTable === 'activityLogs' && (
              <>
                <h2 style={{ color: '#4fd1c5', marginBottom: 24 }}>Activity Logs</h2>
                <form onSubmit={editId ? (e) => { e.preventDefault(); handleUpdateActivityLog(editId); } : handleCreateActivityLog} style={{ marginBottom: 24, display: 'flex', gap: 12, alignItems: 'center' }}>
                  <input placeholder="Description" value={form.description || ''} onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))} style={{ padding: 8, borderRadius: 4, border: '1px solid #444', background: '#23283a', color: '#fff' }} required />
                  <input placeholder="Category" value={form.category || ''} onChange={e => setForm((f: any) => ({ ...f, category: e.target.value }))} style={{ padding: 8, borderRadius: 4, border: '1px solid #444', background: '#23283a', color: '#fff' }} required />
                  <button type="submit" style={{ background: '#4fd1c5', color: '#181c24', border: 'none', borderRadius: 4, padding: '8px 20px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>{editId ? 'Update' : 'Add'}</button>
                  {editId && <button type="button" onClick={() => { setEditId(null); setForm({}); }} style={{ background: '#2d3748', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>}
                </form>
                <table style={{ width: '100%', color: 'white', background: '#23283a', borderCollapse: 'collapse', borderRadius: 8, overflow: 'hidden' }}>
                  <thead>
                    <tr style={{ background: '#2d3748' }}>
                      <th style={{ border: '1px solid #444', padding: '12px', textAlign: 'left' }}>Description</th>
                      <th style={{ border: '1px solid #444', padding: '12px' }}>Category</th>
                      <th style={{ border: '1px solid #444', padding: '12px' }}>Timestamp</th>
                      <th style={{ border: '1px solid #444', padding: '12px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityLogs.map((a: any) => (
                      <tr key={a.id}>
                        <td style={{ border: '1px solid #444', padding: '12px', textAlign: 'left' }}>{editId === a.id ? <input value={form.description || ''} onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))} style={{ padding: 6, borderRadius: 4, border: '1px solid #444', background: '#23283a', color: '#fff' }} /> : a.description}</td>
                        <td style={{ border: '1px solid #444', padding: '12px' }}>{editId === a.id ? <input value={form.category || ''} onChange={e => setForm((f: any) => ({ ...f, category: e.target.value }))} style={{ padding: 6, borderRadius: 4, border: '1px solid #444', background: '#23283a', color: '#fff' }} /> : a.category}</td>
                        <td style={{ border: '1px solid #444', padding: '12px' }}>{a.timestamp?.toDate ? a.timestamp.toDate().toLocaleString() : a.timestamp ? new Date(a.timestamp).toLocaleString() : ""}</td>
                        <td style={{ border: '1px solid #444', padding: '12px' }}>
                          {editId === a.id ? (
                            <>
                              <button onClick={() => handleUpdateActivityLog(a.id)} style={{ background: '#4fd1c5', color: '#181c24', border: 'none', borderRadius: 4, padding: '6px 12px', fontWeight: 600, marginRight: 6, cursor: 'pointer' }}>Save</button>
                              <button onClick={() => { setEditId(null); setForm({}); }} style={{ background: '#2d3748', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => { setEditId(a.id); setForm({ description: a.description, category: a.category }); }} style={{ background: '#4fd1c5', color: '#181c24', border: 'none', borderRadius: 4, padding: '6px 12px', fontWeight: 600, marginRight: 6, cursor: 'pointer' }}>Edit</button>
                              <button onClick={() => handleDeleteActivityLog(a.id)} style={{ background: '#e53e3e', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {activityLogs.length === 0 && !error && <div>No activity logs found.</div>}
              </>
            )}
            {selectedTable === 'categories' && (
              <>
                <h2 style={{ color: '#4fd1c5', marginBottom: 24 }}>Categories</h2>
                <form onSubmit={editId ? (e) => { e.preventDefault(); handleUpdateCategory(editId); } : handleCreateCategory} style={{ marginBottom: 24, display: 'flex', gap: 12, alignItems: 'center' }}>
                  <input placeholder="Name" value={form.name || ''} onChange={e => setForm((f: any) => ({ ...f, name: e.target.value }))} style={{ padding: 8, borderRadius: 4, border: '1px solid #444', background: '#23283a', color: '#fff' }} required />
                  <input placeholder="Description" value={form.description || ''} onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))} style={{ padding: 8, borderRadius: 4, border: '1px solid #444', background: '#23283a', color: '#fff' }} />
                  <button type="submit" style={{ background: '#4fd1c5', color: '#181c24', border: 'none', borderRadius: 4, padding: '8px 20px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>{editId ? 'Update' : 'Add'}</button>
                  {editId && <button type="button" onClick={() => { setEditId(null); setForm({}); }} style={{ background: '#2d3748', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>}
                </form>
                <table style={{ width: '100%', color: 'white', background: '#23283a', borderCollapse: 'collapse', borderRadius: 8, overflow: 'hidden' }}>
                  <thead>
                    <tr style={{ background: '#2d3748' }}>
                      <th style={{ border: '1px solid #444', padding: '12px' }}>Name</th>
                      <th style={{ border: '1px solid #444', padding: '12px', textAlign: 'left' }}>Description</th>
                      <th style={{ border: '1px solid #444', padding: '12px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((c: any) => (
                      <tr key={c.id}>
                        <td style={{ border: '1px solid #444', padding: '12px' }}>{editId === c.id ? <input value={form.name || ''} onChange={e => setForm((f: any) => ({ ...f, name: e.target.value }))} style={{ padding: 6, borderRadius: 4, border: '1px solid #444', background: '#23283a', color: '#fff' }} /> : c.name}</td>
                        <td style={{ border: '1px solid #444', padding: '12px', textAlign: 'left' }}>{editId === c.id ? <input value={form.description || ''} onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))} style={{ padding: 6, borderRadius: 4, border: '1px solid #444', background: '#23283a', color: '#fff' }} /> : c.description}</td>
                        <td style={{ border: '1px solid #444', padding: '12px' }}>
                          {editId === c.id ? (
                            <>
                              <button onClick={() => handleUpdateCategory(c.id)} style={{ background: '#4fd1c5', color: '#181c24', border: 'none', borderRadius: 4, padding: '6px 12px', fontWeight: 600, marginRight: 6, cursor: 'pointer' }}>Save</button>
                              <button onClick={() => { setEditId(null); setForm({}); }} style={{ background: '#2d3748', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => { setEditId(c.id); setForm({ name: c.name, description: c.description }); }} style={{ background: '#4fd1c5', color: '#181c24', border: 'none', borderRadius: 4, padding: '6px 12px', fontWeight: 600, marginRight: 6, cursor: 'pointer' }}>Edit</button>
                              <button onClick={() => handleDeleteCategory(c.id)} style={{ background: '#e53e3e', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 12px', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {categories.length === 0 && !error && <div>No categories found.</div>}
              </>
            )}
          </main>
        </div>
      )}
    </div>
  );
}

export default App;
