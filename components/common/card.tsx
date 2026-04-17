type Props = Readonly<{
  children: React.ReactNode;
}>;

export default function Card({ children }: Props) {
  return (
    <div className="flex w-full flex-col gap-5 rounded-[16px] bg-background-section p-6">
      {children}
    </div>
  );
}
