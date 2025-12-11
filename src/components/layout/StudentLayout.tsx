import { Sidebar } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

const StudentLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;