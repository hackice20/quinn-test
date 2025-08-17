import { Link, useLocation } from "react-router";

type LayoutProps = {
  children: React.ReactNode;
  title?: string;
};

const navItems: { label: string; to: string }[] = [
  {
    label: "Home",
    to: "/",
  },
  {
    label: "Carousel",
    to: "/carousel",
  },
  {
    label: "Invoice",
    to: "/invoices",
  },
];

export default function Layout({ children, title }: LayoutProps) {
  const location = useLocation();
  return (
    <div className="p-2 md:p-4">
      <nav className="flex sticky top-0 gap-4 mb-4 text-sm justify-center p-4 bg-white rounded-lg border border-gray-200 z-10">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={location.pathname === item.to ? "text-blue-500" : ""}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="flex flex-col gap-4 bg-[#f6f6f6] rounded-lg border border-gray-200 p-4">
        <h1 className="text-2xl font-bold my-2">{title}</h1>

        {children}
      </div>
    </div>
  );
}
