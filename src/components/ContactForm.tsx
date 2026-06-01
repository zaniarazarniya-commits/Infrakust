import { useState, type FormEvent } from 'react';

type Status = 'idle' | 'sending' | 'success' | 'error';

const inputClass =
  'w-full rounded-md border border-white/12 bg-white/[0.03] px-4 py-3 font-sans text-base text-text-primary placeholder:text-text-muted transition-colors focus:border-accent-gold focus:outline-none';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setError('');

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || 'Något gick fel.');
      }
      setStatus('success');
      form.reset();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Något gick fel.');
    }
  }

  if (status === 'success') {
    return (
      <div className="mt-10 w-full max-w-[520px] rounded-lg border border-accent-gold/30 bg-accent-gold/[0.06] px-6 py-8 text-center">
        <p className="font-serif text-2xl text-text-primary">Tack — meddelandet är skickat!</p>
        <p className="mt-3 font-sans text-base text-text-secondary">
          Vi hör av oss inom kort. Vill du hellre maila direkt når du oss på{' '}
          <a href="mailto:hello@infrakust.se" className="text-accent-gold">
            hello@infrakust.se
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 w-full max-w-[520px] text-left" noValidate>
      {/* Honeypot — döljs för människor, fångar bottar. */}
      <div aria-hidden="true" className="absolute left-[-9999px]">
        <label>
          Lämna tomt
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="name" className="mb-1.5 block font-sans text-sm text-text-secondary">
            Namn
          </label>
          <input id="name" name="name" type="text" required autoComplete="name" className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block font-sans text-sm text-text-secondary">
            E-post
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} />
        </div>
        <div>
          <label htmlFor="message" className="mb-1.5 block font-sans text-sm text-text-secondary">
            Meddelande
          </label>
          <textarea id="message" name="message" rows={5} required className={`${inputClass} resize-y`} />
        </div>
      </div>

      {status === 'error' && (
        <p role="alert" className="mt-4 font-sans text-sm text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="mt-6 inline-flex items-center justify-center rounded-md bg-accent-gold px-7 py-3 font-sans text-base font-medium text-bg-primary transition-colors hover:bg-accent-gold-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'sending' ? 'Skickar…' : 'Skicka meddelande'}
      </button>
    </form>
  );
}
