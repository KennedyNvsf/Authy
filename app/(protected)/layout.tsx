import { NavBar }  from "./_components/NavBar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
};

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return ( 
    <div className="h-full w-full flex flex-col gap-y-10 items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-400 to-orange-800">
      <NavBar />
      {children}
    </div>
   );
}
 
export default ProtectedLayout;