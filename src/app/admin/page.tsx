'use client';

import { FormEvent, useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

type Code = { id: string; intended_email: string | null; expires_at: string | null; revoked_at: string | null; max_redemptions: number; redemption_count: number; created_at: string };
type Application = { user_id: string; short_message: string; created_at: string; agents: { display_name: string; email: string } | null };

export default function AdminPage() {
  const supabase = createSupabaseBrowserClient();
  const [codes, setCodes] = useState<Code[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [email, setEmail] = useState('');
  const [days, setDays] = useState('30');
  const [max, setMax] = useState('1');
  const [newCode, setNewCode] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    const [{ data: codeRows }, { data: appRows }] = await Promise.all([
      supabase.from('agent_registration_codes').select('id,intended_email,expires_at,revoked_at,max_redemptions,redemption_count,created_at').order('created_at', { ascending: false }),
      supabase.from('agent_applications').select('user_id,short_message,created_at,agents(display_name,email)').order('created_at', { ascending: false }),
    ]);
    setCodes((codeRows ?? []) as Code[]);
    setApplications((appRows ?? []) as unknown as Application[]);
    setLoading(false);
  }

  useEffect(() => { void load(); }, []);

  async function issue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(''); setNewCode('');
    const expiry = new Date(Date.now() + Number(days) * 86400000).toISOString();
    const { data, error } = await supabase.rpc('create_agent_referral_code', {
      p_intended_email: email.trim() || null,
      p_expires_at: expiry,
      p_max_redemptions: Number(max),
    });
    if (error || !data?.[0]) {
      setMessage(error?.message || 'Could not issue the referral code.');
      return;
    }
    setNewCode(data[0].referral_code);
    setEmail('');
    await load();
  }

  async function revoke(id: string) {
    const { error } = await supabase.from('agent_registration_codes').update({ revoked_at: new Date().toISOString() }).eq('id', id);
    setMessage(error ? 'Could not revoke the code.' : 'Referral code revoked.');
    await load();
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.assign('/access');
  }

  return (
    <main className="verificationPage">
      <section className="verificationCard" style={{ maxWidth: 980, width: 'min(94vw, 980px)' }}>
        <div className="verificationBadge">EXPODIA MANAGEMENT</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center' }}>
          <div><h1 style={{ marginTop: 12 }}>Admin dashboard</h1><p>Manage professional invitations and review human-agent applications.</p></div>
          <button className="publicSecondary" type="button" onClick={signOut}>Log out</button>
        </div>

        <section style={{ marginTop: 28 }}>
          <h2>Issue agent referral</h2>
          <p>Generate a six-digit invitation for an Expodia professional. Bind it to an email when you know the invited worker.</p>
          <form onSubmit={issue} style={{ display: 'grid', gap: 12, gridTemplateColumns: '2fr 1fr 1fr auto', alignItems: 'end' }}>
            <label>Invited email (optional)<input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="agent@example.com" /></label>
            <label>Valid for<select value={days} onChange={e => setDays(e.target.value)}><option value="1">1 day</option><option value="7">7 days</option><option value="30">30 days</option><option value="90">90 days</option></select></label>
            <label>Uses<select value={max} onChange={e => setMax(e.target.value)}><option value="1">1</option><option value="5">5</option><option value="10">10</option></select></label>
            <button className="primary" type="submit">Generate</button>
          </form>
          {newCode && <div className="notice" style={{ marginTop: 16 }}><strong>New referral code: {newCode}</strong><br/>Give this code only to the invited professional.</div>}
          {message && <div className="notice" role="status" style={{ marginTop: 12 }}>{message}</div>}
        </section>

        <section style={{ marginTop: 36 }}>
          <h2>Referral codes</h2>
          {loading ? <p>Loading…</p> : codes.length === 0 ? <p>No referral codes have been issued.</p> : <div style={{ overflowX: 'auto' }}><table><thead><tr><th>Invited email</th><th>Expires</th><th>Uses</th><th>Status</th><th /></tr></thead><tbody>{codes.map(code => <tr key={code.id}><td>{code.intended_email || 'Any invited email'}</td><td>{code.expires_at ? new Date(code.expires_at).toLocaleString() : 'No expiry'}</td><td>{code.redemption_count}/{code.max_redemptions}</td><td>{code.revoked_at ? 'Revoked' : code.expires_at && new Date(code.expires_at) <= new Date() ? 'Expired' : 'Active'}</td><td>{!code.revoked_at && <button className="publicSecondary" type="button" onClick={() => revoke(code.id)}>Revoke</button>}</td></tr>)}</tbody></table></div>}
        </section>

        <section style={{ marginTop: 36 }}>
          <h2>Professional applications</h2>
          {applications.length === 0 ? <p>No applications yet.</p> : <div style={{ display: 'grid', gap: 12 }}>{applications.map(app => <article key={app.user_id} className="notice"><strong>{app.agents?.display_name || 'Applicant'}</strong><br/><span>{app.agents?.email}</span><p style={{ marginBottom: 0 }}>{app.short_message}</p><small>{new Date(app.created_at).toLocaleString()}</small></article>)}</div>}
        </section>
      </section>
    </main>
  );
}
