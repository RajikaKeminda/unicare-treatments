import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeaderNavigation from "@/components/layout/HeaderNavigation"
import ShoppingCart from "@/components/layout/Shopping-cart"

export default function Home() {
  return (
    <>
      <HeaderNavigation />
      <Header />
      <ShoppingCart/>
      <Footer />
    </>

  );
}
