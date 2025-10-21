import Footer from "@/components/home/footer";
import Header from "@/components/home/header";
import { Outlet } from "react-router-dom";

export default function LayoutHome() {
  return (
    <main>
      <Header />
      <Outlet />
      <Footer />
    </main>
  );
}
