import Navbar from "../Navbar";

const Layout = ({ children }) => (
  <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
    <Navbar />
    {children}
  </div>
);

export default Layout;