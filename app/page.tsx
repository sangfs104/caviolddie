import Link from "next/link";

export default function Home() {
  return (
    <div
      className="relative w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/img/placeholder.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Nút SHOP */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <Link
          href="/products"
          className="px-10 py-4 text-white text-xl font-semibold border-2 border-white hover:bg-white hover:text-black transition-colors duration-300 tracking-widest"
        >
          SHOP
        </Link>
      </div>
    </div>
  );
}
