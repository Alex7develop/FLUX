import { Link } from 'react-router-dom';

const chapters = [
  {
    title: 'Transfer',
    body: 'Move anything between phone, laptop, and web without thinking about cables, folders, or apps.',
  },
  {
    title: 'Understand',
    body: 'FLUX reads the screenshot, receipt, card, or URL and surfaces the useful part.',
  },
  {
    title: 'Connect',
    body: 'Related items find each other — a hotel, a date, a place, a person — without you filing them.',
  },
  {
    title: 'Find',
    body: 'Search by meaning, not filenames. If you remember why it mattered, FLUX can find it.',
  },
];

export function LandingPage() {
  return (
    <main>
      <section className="mx-auto flex min-h-[78vh] max-w-5xl flex-col items-center justify-center px-6 text-center">
        <p className="font-mono text-[11px] tracking-[0.32em] text-mute uppercase">
          Phone ↔ Phone ↔ Mac ↔ Windows ↔ Web
        </p>
        <h1 className="mt-8 max-w-3xl text-5xl leading-[0.95] font-semibold tracking-[-0.06em] md:text-7xl">
          Drop anything.
          <br />
          It figures out the rest.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-mute">
          FLUX is a living inbox for information in motion. Send it here. We handle destination,
          meaning, and memory.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link to="/app" className="flux-button flux-button--primary">
            Try FLUX
          </Link>
          <a href="#how" className="flux-button flux-button--ghost">
            See how it works
          </a>
        </div>
      </section>

      <section id="how" className="mx-auto grid max-w-5xl gap-6 px-6 pb-24 md:grid-cols-2">
        {chapters.map((chapter) => (
          <article
            key={chapter.title}
            className="rounded-[24px] border border-line bg-surface/70 p-8 backdrop-blur-xl"
          >
            <h2 className="text-2xl font-semibold tracking-tight">{chapter.title}</h2>
            <p className="mt-3 text-mute">{chapter.body}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
