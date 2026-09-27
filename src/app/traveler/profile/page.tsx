'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

type Profile = { username: string };

export default function TravelerProfilePage() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.replace('/access'); return; }
      const { data: row } = await supabase.from('traveler_profiles').select('username').eq('user_id', data.user.id).maybeSingle();
      if (mounted) {
        setProfile(row ?? null);
        setEmail(data.user.email ?? '');
      }
    });
    return () => { mounted = false; };
  }, [router, supabase]);

  async function savePin() {
    setError(''); setMessage('');
    if (!/^\d{4}$/.test(pin)) { setError('Your Expodia PIN must contain exactly four digits.'); return; }
    if (pin !== confirmPin) { setError('The PIN entries do not match.'); return; }
    setSaving(true);
    const { data, error: rpcError } = await supabase.rpc('set_traveler_security', { p_pin: pin });
    if (rpcError || data !== true) setError('The PIN could not be saved. Please try again.');
    else { setMessage('Your personal Expodia PIN is active.'); setPin(''); setConfirmPin(''); }
    setSaving(false);
  }

  async function lockApp() {
    localStorage.setItem('expodia_app_locked', '1');
    router.replace('/traveler');
  }

  async function signOut() {
    localStorage.removeItem('expodia_app_locked');
    await supabase.auth.signOut();
    router.replace('/access');
  }

  if (!profile) {
    return <main className="travelerApp"><div className="travelerAppLoading">Loading your traveler space…</div></main>;
  }

  return (
    <main className="travelerApp">
      <header className="travelerAppHeader">
        <Link href="/traveler" className="travelerAppBrand">Expodia</Link>
        <nav className="travelerAppNav" aria-label="Traveler navigation">
          <Link href="/traveler">Home</Link><Link href="/traveler?tab=groups">Groups</Link><Link href="/support">Inbox</Link>
          <span className="travelerNavActive">Profile</span>
        </nav>
      </header>

      <section className="travelerProfilePage">
        <div className="travelerProfileIdentity">
          <div className="travelerAvatar">{profile.username.slice(0, 1).toUpperCase()}</div>
          <div><div className="publicEyebrow">TRAVELER</div><h1>@{profile.username}</h1><p>{email}</p></div>
        </div>

        <div className="travelerProfileGrid">
          <section className="travelerProfileCard">
            <div className="publicEyebrow">ACCOUNT</div>
            <h2>Your traveler space</h2>
            <p>This is your private Expodia account area. Your profile page does not display other travelers' profiles.</p>
            <Link className="publicSecondary" href="/traveler">Return to home</Link>
          </section>

          <section className="travelerProfileCard">
            <div className="publicEyebrow">SECURITY</div>
            <h2>Personal PIN</h2>
            <p>Create or change the four-digit PIN used to unlock your traveler space after you lock the app.</p>
            <div className="travelerPinForm">
              <input inputMode="numeric" autoComplete="off" maxLength={4} value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0,4))} placeholder="New PIN" aria-label="New PIN" />
              <input inputMode="numeric" autoComplete="off" maxLength={4} value={confirmPin} onChange={e => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0,4))} placeholder="Confirm PIN" aria-label="Confirm PIN" />
              <button className="publicPrimary" onClick={savePin} disabled={saving}>{saving ? 'Saving…' : 'Save PIN'}</button>
            </div>
          </section>

          <section className="travelerProfileCard">
            <div className="publicEyebrow">APP CONTROL</div>
            <h2>Lock this space</h2>
            <p>Lock the traveler space without signing out. The next unlock uses your personal PIN.</p>
            <button className="publicSecondary" onClick={lockApp}>Lock Expodia</button>
          </section>

          <section className="travelerProfileCard">
            <div className="publicEyebrow">SETTINGS</div>
            <h2>Account settings</h2>
            <div className="travelerSettingsList">
              <div><span>Email</span><strong>{email}</strong></div>
              <div><span>Username</span><strong>@{profile.username}</strong></div>
              <div><span>Account</span><strong>Traveler</strong></div>
            </div>
          </section>
        </div>

        {message && <div className="notice" role="status">{message}</div>}
        {error && <div className="notice" role="alert">{error}</div>}
        <button className="travelerDangerAction" onClick={signOut}>Sign out</button>
      </section>
    </main>
  );
}
