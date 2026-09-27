'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

type Mode = 'signin' | 'signup';
type SignupKind = 'traveler' | 'job';

export default function AccessPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('signin');
  const [signupKind, setSignupKind] = useState<SignupKind>('traveler');
  const [jobType, setJobType] = useState('agent');
  const [agentCode, setAgentCode] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeStep, setCodeStep] = useState(false);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(''); setMessage(''); setLoading(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '').trim();
    const password = String(form.get('password') ?? '');
    const supabase = createSupabaseBrowserClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError('Sign-in failed. Check your details and try again.');
      setLoading(false);
      return;
    }
    const { data: agent } = await supabase.from('agents').select('id').eq('id', data.user.id).maybeSingle();
    router.push(agent ? '/' : '/traveler');
  }

  async function submitSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(''); setMessage('');
    const form = new FormData(event.currentTarget);
    const fullName = String(form.get('fullName') ?? '').trim();
    const email = String(form.get('email') ?? '').trim();
    const shortMessage = String(form.get('shortMessage') ?? '').trim();

    if (signupKind === 'traveler') {
      router.push('/traveler/signup');
      return;
    }

    if (jobType !== 'agent') {
      setMessage('That opportunity is not currently open. Please try again later.');
      return;
    }

    if (!fullName || !email || !shortMessage) {
      setError('Enter your full name, email and a short message first.');
      return;
    }

    if (!codeStep) {
      setCodeStep(true);
      return;
    }

    if (!/^\d{6}$/.test(agentCode)) {
      setError('Enter the six-digit Expodia registration code.');
      return;
    }

    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { data: valid, error: codeError } = await supabase.rpc('verify_agent_registration_code', { p_code: agentCode });
    if (codeError || valid !== true) {
      setError('That registration code is not valid or is no longer active.');
      setLoading(false);
      return;
    }

    const password = String(form.get('password') ?? '');
    if (password.length < 8) {
      setError('Create a password of at least 8 characters.');
      setLoading(false);
      return;
    }

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, professional_application: true } },
    });

    if (signupError || !data.user) {
      setError(signupError?.message || 'We could not create the professional account.');
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase.from('agents').insert({
      id: data.user.id,
      display_name: fullName,
      email,
    });

    if (profileError) {
      await supabase.auth.signOut();
      setError('Your account could not be completed. Please contact an Expodia administrator.');
      setLoading(false);
      return;
    }

    setMessage(data.session
      ? 'Your Expodia professional account is ready.'
      : 'Your professional account has been created. Check your email if confirmation is required, then sign in.');
    setLoading(false);
    setMode('signin');
    setCodeStep(false);
    setAgentCode('');
  }

  return (
    <main className="verificationPage">
      <section className="verificationCard travelerAuthCard">
        <div className="verificationBadge">EXPODIA</div>
        <h1 style={{ marginTop: 12 }}>Access</h1>
        <p>Choose how you want to use Expodia. Travelers can create a space. Professional access is reserved for authorized Expodia workers.</p>

        <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
          <button className={mode === 'signin' ? 'primary' : 'publicSecondary'} type="button" onClick={() => { setMode('signin'); setError(''); setMessage(''); }}>Sign in</button>
          <button className={mode === 'signup' ? 'primary' : 'publicSecondary'} type="button" onClick={() => { setMode('signup'); setError(''); setMessage(''); }}>Sign up</button>
        </div>

        {mode === 'signin' ? (
          <form onSubmit={signIn} style={{ display: 'grid', gap: 16, marginTop: 24 }}>
            <label>Email<input name="email" type="email" autoComplete="email" required /></label>
            <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
            <button className="primary" type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
            <div className="travelerAuthLinks">
              <Link href="/traveler/login">Traveler sign-in</Link>
              <Link href="/login">Professional sign-in</Link>
            </div>
          </form>
        ) : (
          <div style={{ marginTop: 24 }}>
            <label>What do you want to sign up for?
              <select value={signupKind} onChange={(e) => { setSignupKind(e.target.value as SignupKind); setCodeStep(false); setError(''); }}>
                <option value="traveler">Traveler space</option>
                <option value="job">I need a job</option>
              </select>
            </label>

            {signupKind === 'traveler' ? (
              <div className="notice" style={{ marginTop: 16 }}>
                Create a traveler space for saved journeys, documents and travel plans.
                <div style={{ marginTop: 12 }}><Link href="/traveler/signup">Continue to traveler sign up →</Link></div>
              </div>
            ) : (
              <form onSubmit={submitSignup} style={{ display: 'grid', gap: 16, marginTop: 16 }}>
                <label>Opportunity
                  <select name="jobType" value={jobType} onChange={(e) => { setJobType(e.target.value); setCodeStep(false); setError(''); }}>
                    <option value="agent">Travel agent / booking professional</option>
                    <option value="other">Other opportunities</option>
                  </select>
                </label>

                <label>Full name<input name="fullName" autoComplete="name" required /></label>
                <label>Email<input name="email" type="email" autoComplete="email" required /></label>
                <label>Short message<textarea name="shortMessage" rows={4} maxLength={500} placeholder="Tell Expodia briefly about your experience or what you can do." required /></label>

                {jobType === 'agent' && codeStep && (
                  <>
                    <label>Six-digit Expodia registration code<input value={agentCode} onChange={(e) => setAgentCode(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" placeholder="000000" maxLength={6} required /></label>
                    <label>Password<input name="password" type="password" autoComplete="new-password" minLength={8} required /></label>
                  </>
                )}

                {jobType === 'other' ? (
                  <button className="primary" type="submit">Submit</button>
                ) : (
                  <button className="primary" type="submit" disabled={loading}>{codeStep ? (loading ? 'Creating account…' : 'Verify code & create account') : 'Continue'}</button>
                )}

                {error && <div className="notice" role="alert">{error}</div>}
                {message && <div className="notice" role="status">{message}</div>}
              </form>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
