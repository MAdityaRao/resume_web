type Props = {
  code: string;
  label: string;
};

export default function SignalDivider({ code, label }: Props) {
  return (
    <div className="flex items-center gap-4 mb-12">
      <span className="font-mono text-xs tracking-[0.2em] text-cyan whitespace-nowrap">
        {code}
      </span>
      <span className="h-px flex-1 bg-border" />
      <span className="font-mono text-xs tracking-[0.2em] text-faint uppercase whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}
