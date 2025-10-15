"use client";

interface RadiusSelectorProps {
  value: number;
  onChange: (value: number) => void;
  compact?: boolean;
}

const RADIUS_OPTIONS = [
  { label: "0.5 mi", value: 805 },
  { label: "1 mi", value: 1609 },
  { label: "2 mi", value: 3219 },
  { label: "5 mi", value: 8047 },
];

export function RadiusSelector({
  value,
  onChange,
  compact,
}: RadiusSelectorProps) {
  return (
    <div className="w-full">
      <label
        className={`block font-medium text-foreground ${
          compact ? "text-xs mb-1.5" : "text-sm mb-2"
        }`}
      >
        Search Radius
      </label>
      <div className="grid grid-cols-4 gap-2">
        {RADIUS_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`rounded-lg font-semibold transition-all ${
              compact ? "h-9 text-xs" : "h-11 text-sm"
            } ${
              value === option.value
                ? "bg-primary text-primary-foreground ring-2 ring-primary/20 shadow-sm"
                : "bg-card text-muted-foreground border border-border hover:border-primary/50 hover:text-foreground"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
