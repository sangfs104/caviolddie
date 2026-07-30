// "use client";

// import React, { useState, useEffect } from "react";
// import { Search, ShoppingBag, User, ChevronDown, Menu, X } from "lucide-react";
// import Link from "next/link";
// import { useSelector } from "react-redux";
// import { RootState } from "../../redux/store";
// import { useRouter } from "next/navigation";
// import CartDrawer from "./Cartdrawer";
// import { useCart } from "@/contexts/CartContext";

// interface SubMenuItem {
//   label: string;
//   href: string;
// }

// interface NavItem {
//   label: string;
//   href: string;
//   submenu?: SubMenuItem[];
// }

// const navItems: NavItem[] = [
//   {
//     label: "ABOUT US",
//     href: "#",
//     submenu: [
//       { label: "INFORMATION", href: "/about/information" },
//       { label: "CONTACT", href: "/about/contact" },
//     ],
//   },
//   {
//     label: "SHOP",
//     href: "/products",
//     submenu: [
//       { label: "NEW ARRIVALS", href: "/products?filter=new" },
//       { label: "ALL PRODUCTS", href: "/products" },
//     ],
//   },
//   {
//     label: "CAMPAIGN",
//     href: "#",
//     submenu: [
//       { label: "LOOKBOOK", href: "/campaign/lookbook" },
//       { label: "COLLABORATIONS", href: "/campaign/collab" },
//     ],
//   },
//   {
//     label: "WOLRWIDE SHIPPING",
//     href: "#",
//     submenu: [
//       { label: "SHIPPING POLICY", href: "/shipping/policy" },
//       { label: "TRACK ORDER", href: "/shipping/track" },
//     ],
//   },
// ];

// const Header = () => {
//   const [loggedInUser, setLoggedInUser] = useState<{
//     id?: string;
//     name?: string;
//   } | null>(null);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const router = useRouter();
//   const reduxUser = useSelector((state: RootState) => state.auth.user);

//   // ✅ Lấy cartItems trực tiếp từ CartContext — cùng nguồn dữ liệu với CartDrawer
//   const { cartItems } = useCart();

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const storedUser = localStorage.getItem("user");
//       if (storedUser) {
//         setLoggedInUser(JSON.parse(storedUser));
//       } else if (reduxUser) {
//         setLoggedInUser(reduxUser);
//       } else {
//         setLoggedInUser(null);
//       }
//     }
//   }, [reduxUser]);

//   // Khoá scroll nền khi menu mobile hoặc giỏ hàng đang mở
//   useEffect(() => {
//     document.body.style.overflow = isMenuOpen || isCartOpen ? "hidden" : "auto";
//   }, [isMenuOpen, isCartOpen]);

//   const cartCount = cartItems.reduce(
//     (sum, item) => sum + (item.quantity || 0),
//     0,
//   );

//   return (
//     <>
//       {/* Main Header */}
//       <header className="flex justify-between items-center px-4 sm:px-8 md:px-12 py-4 border-b border-gray-200 bg-white relative z-30">
//         {/* Left Section - Logo */}
//         <div className="flex items-center">
//           <button
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="lg:hidden text-gray-700 mr-3 focus:outline-none"
//           >
//             {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
//           </button>

//           <Link href="/" className="flex items-center">
//             <span className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 select-none">
//               CAVIOLDDIE
//             </span>
//           </Link>
//         </div>

//         {/* Center Section - Desktop Nav with dropdowns */}
//         <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium tracking-wide text-gray-600">
//           {navItems.map((item) => (
//             <div
//               key={item.label}
//               className="relative group h-full flex items-center"
//             >
//               <Link
//                 href={item.href}
//                 className="flex items-center gap-1 py-6 hover:text-gray-700 transition-colors"
//               >
//                 {item.label}
//                 {item.submenu && (
//                   <ChevronDown
//                     size={14}
//                     className="mt-[1px] transition-transform duration-200 group-hover:rotate-180"
//                   />
//                 )}
//               </Link>

//               {item.submenu && (
//                 <div
//                   className="absolute left-0 top-full min-w-[190px] bg-white border border-gray-100 shadow-lg
//                              opacity-0 invisible translate-y-1
//                              group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
//                              transition-all duration-200 ease-out py-2"
//                 >
//                   {item.submenu.map((sub) => (
//                     <Link
//                       key={sub.label}
//                       href={sub.href}
//                       className="block px-5 py-2.5 text-xs font-normal tracking-wide text-gray-600 hover:text-gray-900 hover:bg-gray-50"
//                     >
//                       {sub.label}
//                     </Link>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </nav>

//         {/* Right Section - Icons */}
//         <div className="flex items-center space-x-4 sm:space-x-5">
//           <Search
//             size={18}
//             strokeWidth={1.75}
//             className="cursor-pointer text-gray-700 hover:text-gray-500"
//           />

//           {loggedInUser?.name ? (
//             <span
//               className="text-xs sm:text-sm cursor-pointer hover:underline"
//               onClick={() => router.push("/profile")}
//             >
//               {loggedInUser.name}
//             </span>
//           ) : (
//             <User
//               size={18}
//               strokeWidth={1.75}
//               className="cursor-pointer text-gray-700 hover:text-gray-500"
//               onClick={() => router.push("/login")}
//             />
//           )}

//           <div className="relative">
//             <ShoppingBag
//               size={18}
//               strokeWidth={1.75}
//               className="cursor-pointer text-gray-700 hover:text-gray-500"
//               onClick={() => setIsCartOpen(true)}
//             />
//             {cartCount > 0 && (
//               <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
//                 {cartCount}
//               </span>
//             )}
//           </div>
//         </div>
//       </header>

//       {/* Mobile Navigation Menu */}
//       <nav
//         className={`lg:hidden fixed top-[72px] left-0 h-[calc(100%-72px)] w-screen bg-white shadow-lg z-20 p-4 overflow-y-auto ${
//           isMenuOpen ? "block" : "hidden"
//         }`}
//       >
//         {navItems.map((item) => (
//           <div key={item.label} className="border-b border-gray-100">
//             <Link
//               href={item.href}
//               className="flex justify-between items-center py-3 font-semibold text-sm"
//               onClick={() => !item.submenu && setIsMenuOpen(false)}
//             >
//               {item.label}
//               {item.submenu && <ChevronDown size={16} />}
//             </Link>
//             {item.submenu && (
//               <div className="pl-4 pb-2">
//                 {item.submenu.map((sub) => (
//                   <Link
//                     key={sub.label}
//                     href={sub.href}
//                     className="block py-2 text-xs text-gray-600"
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     {sub.label}
//                   </Link>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}
//       </nav>

//       {/* Drawer giỏ hàng — chỉ cần open/onClose, tự lấy data từ CartContext */}
//       <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
//     </>
//   );
// };

// export default Header;
"use client";

import React, { useState, useEffect } from "react";
import { Search, ShoppingBag, User, ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useRouter } from "next/navigation";
import CartDrawer from "./Cartdrawer";
import { useCart } from "@/contexts/CartContext";
import { validateStoredSession } from "@/lib/auth";

interface SubMenuItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  submenu?: SubMenuItem[];
}

const navItems: NavItem[] = [
  {
    label: "ABOUT US",
    href: "#",
    submenu: [
      { label: "INFORMATION", href: "/about/information" },
      { label: "CONTACT", href: "/about/contact" },
    ],
  },
  {
    label: "SHOP",
    href: "/products",
    submenu: [
      { label: "NEW ARRIVALS", href: "/products?filter=new" },
      { label: "ALL PRODUCTS", href: "/products" },
    ],
  },
  {
    label: "CAMPAIGN",
    href: "#",
    submenu: [
      { label: "LOOKBOOK", href: "/campaign/lookbook" },
      { label: "COLLABORATIONS", href: "/campaign/collab" },
    ],
  },
  {
    label: "WOLRWIDE SHIPPING",
    href: "#",
    submenu: [
      { label: "SHIPPING POLICY", href: "/shipping/policy" },
      { label: "TRACK ORDER", href: "/shipping/track" },
    ],
  },
];

const Header = () => {
  const [loggedInUser, setLoggedInUser] = useState<{
    id?: string;
    name?: string;
  } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const router = useRouter();
  const reduxUser = useSelector((state: RootState) => state.auth.user);

  const { cartItems } = useCart();

  // ✅ Đồng bộ trạng thái đăng nhập dựa trên TOKEN CÒN HẠN HAY KHÔNG,
  // chứ không chỉ dựa vào việc key "user" còn nằm trong localStorage.
  // Trước đây: dù token đã hết hạn qua đêm, Header vẫn hiện tên vì
  // "user" vẫn còn trong storage -> gây cảm giác "vẫn đăng nhập" trong khi
  // mọi API call thực tế đều bị BE từ chối (401).
  const syncAuthState = () => {
    const stillValid = validateStoredSession();
    if (!stillValid) {
      setLoggedInUser(null);
      return;
    }
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setLoggedInUser(JSON.parse(storedUser));
      } catch {
        setLoggedInUser(null);
      }
    } else if (reduxUser) {
      setLoggedInUser(reduxUser);
    } else {
      setLoggedInUser(null);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    syncAuthState();

    // Nếu bất kỳ API call nào ở bất kỳ trang nào phát hiện phiên hết hạn
    // (401 hoặc token hết hạn), Header sẽ nghe được và cập nhật ngay lập
    // tức, không cần load lại trang.
    const handleAuthExpired = () => setLoggedInUser(null);
    window.addEventListener("auth:expired", handleAuthExpired);

    return () => {
      window.removeEventListener("auth:expired", handleAuthExpired);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxUser]);

  // Khoá scroll nền khi menu mobile hoặc giỏ hàng đang mở
  useEffect(() => {
    document.body.style.overflow = isMenuOpen || isCartOpen ? "hidden" : "auto";
  }, [isMenuOpen, isCartOpen]);

  const cartCount = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0,
  );

  return (
    <>
      {/* Main Header */}
      <header className="flex justify-between items-center px-4 sm:px-8 md:px-12 py-4 border-b border-gray-200 bg-white relative z-30">
        {/* Left Section - Logo */}
        <div className="flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-gray-700 mr-3 focus:outline-none"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link href="/" className="flex items-center">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 select-none">
              CAVIOLDDIE
            </span>
          </Link>
        </div>

        {/* Center Section - Desktop Nav with dropdowns */}
        <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium tracking-wide text-gray-600">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative group h-full flex items-center"
            >
              <Link
                href={item.href}
                className="flex items-center gap-1 py-6 hover:text-gray-700 transition-colors"
              >
                {item.label}
                {item.submenu && (
                  <ChevronDown
                    size={14}
                    className="mt-[1px] transition-transform duration-200 group-hover:rotate-180"
                  />
                )}
              </Link>

              {item.submenu && (
                <div
                  className="absolute left-0 top-full min-w-[190px] bg-white border border-gray-100 shadow-lg
                             opacity-0 invisible translate-y-1
                             group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                             transition-all duration-200 ease-out py-2"
                >
                  {item.submenu.map((sub) => (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      className="block px-5 py-2.5 text-xs font-normal tracking-wide text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right Section - Icons */}
        <div className="flex items-center space-x-4 sm:space-x-5">
          <Search
            size={18}
            strokeWidth={1.75}
            className="cursor-pointer text-gray-700 hover:text-gray-500"
          />

          {loggedInUser?.name ? (
            <span
              className="text-xs sm:text-sm cursor-pointer hover:underline"
              onClick={() => router.push("/profile")}
            >
              {loggedInUser.name}
            </span>
          ) : (
            <User
              size={18}
              strokeWidth={1.75}
              className="cursor-pointer text-gray-700 hover:text-gray-500"
              onClick={() => router.push("/login")}
            />
          )}

          <div className="relative">
            <ShoppingBag
              size={18}
              strokeWidth={1.75}
              className="cursor-pointer text-gray-700 hover:text-gray-500"
              onClick={() => setIsCartOpen(true)}
            />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      <nav
        className={`lg:hidden fixed top-[72px] left-0 h-[calc(100%-72px)] w-screen bg-white shadow-lg z-20 p-4 overflow-y-auto ${
          isMenuOpen ? "block" : "hidden"
        }`}
      >
        {navItems.map((item) => (
          <div key={item.label} className="border-b border-gray-100">
            <Link
              href={item.href}
              className="flex justify-between items-center py-3 font-semibold text-sm"
              onClick={() => !item.submenu && setIsMenuOpen(false)}
            >
              {item.label}
              {item.submenu && <ChevronDown size={16} />}
            </Link>
            {item.submenu && (
              <div className="pl-4 pb-2">
                {item.submenu.map((sub) => (
                  <Link
                    key={sub.label}
                    href={sub.href}
                    className="block py-2 text-xs text-gray-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Drawer giỏ hàng — chỉ cần open/onClose, tự lấy data từ CartContext */}
      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;
