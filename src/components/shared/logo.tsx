const sizes = {
  sm: "text-sm",
  md: "text-md",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
  "6xl": "text-6xl",
};

export default function Logo({ size = "4xl" }: { size?: keyof typeof sizes }) {
  return (
    <h1 className={`${sizes[size]} font-extrabold leading-none`}>
      <span className="text-primary text-shadow-2xs text-shadow-foreground">
        S
      </span>
      <span className="text-secondary text-shadow-2xs text-shadow-foreground">
        B
      </span>
      <span className="text-primary text-shadow-2xs text-shadow-foreground">
        O
      </span>
      <span className="text-secondary text-shadow-2xs text-shadow-foreground">
        R
      </span>
      <span className="text-primary text-shadow-2xs text-shadow-foreground">
        R
      </span>
    </h1>
  );
}
