export default function GameHud({ level, xpInLevel, xpPerLevel, totalXp, badges }) {
  const percent = (xpInLevel / xpPerLevel) * 100;

  return (
    <section className="game-card card mb-4" aria-label="Player progress">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="level-pill">LVL {level}</span>
          <span className="text-secondary small">{totalXp} XP total</span>
        </div>

        <div
          className="progress xp-bar"
          role="progressbar"
          aria-valuenow={xpInLevel}
          aria-valuemin={0}
          aria-valuemax={xpPerLevel}
        >
          <div className="progress-bar xp-fill" style={{ width: `${percent}%` }} />
        </div>
        <p className="small text-secondary mt-1 mb-3">
          {xpInLevel} / {xpPerLevel} XP to next level
        </p>

        <div className="d-flex gap-2 flex-wrap">
          {badges.map((b) => (
            <span
              key={b.id}
              className={`badge-chip${b.earned ? " earned" : ""}`}
              title={b.earned ? `${b.name} (unlocked)` : `${b.name}: add ${b.need} categories`}
            >
              {b.earned ? b.icon : "🔒"} {b.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
