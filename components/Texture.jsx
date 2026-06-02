// Abstract SVG visuals — used in place of photos
// Each takes a `seed` (string), `style` (a/b/c), and renders something distinctive

const Texture = ({ kind = "topo", className = "", style = {} }) => {
  const id = React.useMemo(() => "tex-" + Math.random().toString(36).slice(2, 8), []);

  if (kind === "topo") {
    // Topographic / contour map — concentric organic curves
    return (
      <svg className={className} style={style} viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id={id+"g"} cx="35%" cy="40%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.22"/>
            <stop offset="100%" stopColor="currentColor" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <rect width="400" height="400" fill={`url(#${id}g)`}/>
        {[...Array(14)].map((_, i) => {
          const r = 30 + i * 22;
          const cx = 140 + Math.sin(i*0.7)*20;
          const cy = 180 + Math.cos(i*0.5)*15;
          return <ellipse key={i} cx={cx} cy={cy} rx={r} ry={r*0.78} fill="none" stroke="currentColor" strokeOpacity={0.18 - i*0.008} strokeWidth="1"/>;
        })}
      </svg>
    );
  }

  if (kind === "field") {
    // Soft gradient field with organic blob
    return (
      <svg className={className} style={style} viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id={id+"g"} cx="50%" cy="50%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.45"/>
            <stop offset="60%" stopColor="currentColor" stopOpacity="0.10"/>
            <stop offset="100%" stopColor="currentColor" stopOpacity="0"/>
          </radialGradient>
          <filter id={id+"b"}>
            <feGaussianBlur stdDeviation="20"/>
          </filter>
        </defs>
        <rect width="400" height="400" fill="currentColor" fillOpacity="0.05"/>
        <ellipse cx="200" cy="200" rx="160" ry="140" fill={`url(#${id}g)`} filter={`url(#${id}b)`}/>
      </svg>
    );
  }

  if (kind === "lines") {
    // Diagonal pin-stripes — editorial
    return (
      <svg className={className} style={style} viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id={id} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <line x1="0" y1="0" x2="0" y2="14" stroke="currentColor" strokeWidth="1" strokeOpacity="0.22"/>
          </pattern>
        </defs>
        <rect width="400" height="400" fill={`url(#${id})`}/>
      </svg>
    );
  }

  if (kind === "wave") {
    // Stacked wave / longevity curve
    return (
      <svg className={className} style={style} viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
        {[...Array(12)].map((_, i) => {
          const y = 80 + i * 22;
          const a = 14 - i * 0.4;
          return (
            <path key={i} d={`M -20 ${y} Q 100 ${y-a} 200 ${y} T 420 ${y}`} fill="none" stroke="currentColor" strokeOpacity={0.22 - i * 0.012} strokeWidth="1.2"/>
          );
        })}
      </svg>
    );
  }

  if (kind === "grid") {
    // Crisp data grid
    return (
      <svg className={className} style={style} viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id={id} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeOpacity="0.10" strokeWidth="0.6"/>
          </pattern>
        </defs>
        <rect width="400" height="400" fill={`url(#${id})`}/>
      </svg>
    );
  }

  if (kind === "orbit") {
    // Concentric rings with offset center, like a chart legend
    return (
      <svg className={className} style={style} viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
        <g transform="translate(200 200)">
          {[...Array(10)].map((_, i) => (
            <circle key={i} r={20 + i * 18} fill="none" stroke="currentColor" strokeOpacity={0.25 - i * 0.02} strokeWidth="1"/>
          ))}
          <circle r="4" fill="currentColor"/>
        </g>
      </svg>
    );
  }

  if (kind === "arc") {
    // Sun rising / arc of light
    return (
      <svg className={className} style={style} viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={id+"g"} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.35"/>
            <stop offset="100%" stopColor="currentColor" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <ellipse cx="200" cy="220" rx="220" ry="180" fill={`url(#${id}g)`}/>
        <circle cx="200" cy="180" r="60" fill="currentColor" fillOpacity="0.18"/>
      </svg>
    );
  }

  if (kind === "drops") {
    // Dot matrix — supplement capsules feel
    return (
      <svg className={className} style={style} viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
        {[...Array(8)].map((_, r) => [...Array(8)].map((_, c) => (
          <circle key={r+'-'+c} cx={30 + c*48} cy={30 + r*48} r={2 + ((r*c) % 4)} fill="currentColor" fillOpacity={0.18}/>
        )))}
      </svg>
    );
  }

  return null;
};

window.Texture = Texture;
