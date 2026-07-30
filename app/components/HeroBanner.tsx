// app/components/HeroBanner.tsx
import Image from "next/image";
import Link from "next/link";

const BANNER = {
  image: "/img/banner1.png",
  href: "/products",
};

export default function HeroBanner() {
  return (
    <section className="relative w-full h-[48vh] min-h-[320px] max-h-[520px] overflow-hidden bg-[#111110]">
      <Link
        href={BANNER.href}
        aria-label="Xem sản phẩm"
        className="absolute inset-0 block"
      >
        <Image
          src={BANNER.image}
          alt="Banner"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </Link>

      {/* Gradient nhẹ phía dưới */}
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
    </section>
  );
}
