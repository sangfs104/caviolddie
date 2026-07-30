// app/components/HeroBanner.tsx
import Image from "next/image";
import Link from "next/link";

const BANNER = {
  image: "/img/banner1.png",
  href: "/products",
};

export default function HeroBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-[#111110]">
      <Link href={BANNER.href} aria-label="Xem sản phẩm" className="block">
        {/* Mobile: hiện trọn vẹn ảnh, không crop, không khoảng đen thừa */}
        <div className="relative w-full sm:hidden">
          <Image
            src={BANNER.image}
            alt="Banner"
            width={0}
            height={0}
            sizes="100vw"
            priority
            className="w-full h-auto"
          />
        </div>

        {/* Tablet/Desktop: banner cao cố định như thiết kế gốc */}
        <div className="relative hidden sm:block sm:h-[46vh] sm:min-h-[300px] sm:max-h-[440px] md:h-[48vh] md:min-h-[360px] md:max-h-[520px] lg:max-h-[600px]">
          <Image
            src={BANNER.image}
            alt="Banner"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </Link>

      {/* Gradient nhẹ phía dưới */}
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
    </section>
  );
}
