type LayoutProps = {
  children: React.ReactNode;
  title?: string;
};

export default function Layout({ children, title }: LayoutProps) {
  return (
    <div className="p-2 md:p-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      {children}
    </div>
  );
}
