type Props = Readonly<{
  children: React.ReactNode;
}>;

export default function Card({ children }: Props) {
  return (
    <div className="flex w-full flex-col gap-5 rounded-[16px] bg-background-section p-6 shadow-[0_0_60px_rgba(0,0,0,0.04)]">
      {children}
    </div>
  );
}
