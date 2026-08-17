export function BillingPage() {
  const stripeReady = Boolean(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col px-6 py-16">
      <p className="font-mono text-[11px] tracking-[0.24em] text-mute uppercase">Plans</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">Billing</h1>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <article className="rounded-[24px] border border-line bg-surface/70 p-8">
          <h2 className="text-2xl font-semibold">Free</h2>
          <p className="mt-3 text-mute">Local inbox, pairing, and understanding on this device.</p>
        </article>
        <article className="rounded-[24px] border border-line bg-surface/70 p-8">
          <h2 className="text-2xl font-semibold">FLUX</h2>
          <p className="mt-3 text-mute">Cloud history, more devices, and later AI providers.</p>
          <button type="button" className="flux-button flux-button--primary mt-6" disabled={!stripeReady}>
            {stripeReady ? 'Subscribe' : 'Stripe is not connected'}
          </button>
        </article>
      </div>
    </main>
  );
}
