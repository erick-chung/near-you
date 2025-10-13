"use client";

interface RadiusSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const RADIUS_OPTIONS = [
  { label: "0.5 mi", value: 805 },
  { label: "1 mi", value: 1609 },
  { label: "2 mi", value: 3219 },
  { label: "5 mi", value: 8047 },
];

export function RadiusSelector({ value, onChange }: RadiusSelectorProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-foreground mb-2">
        Search Radius
      </label>
      <div className="grid grid-cols-4 gap-2">
        {RADIUS_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`h-11 rounded-lg text-sm font-semibold transition-all ${
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
