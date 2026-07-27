"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ProfileUser = () => {
  const router = useRouter();
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);

  // Load user từ localStorage
  useEffect(() => {
    const storedUser =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    // Xóa user khỏi localStorage
    localStorage.removeItem("user");
    setUser(null);

    // Redirect về login
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="text-center p-4">
        Không tìm thấy thông tin người dùng.
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Thông tin cá nhân
        </h1>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">ID:</label>
            <p className="border border-gray-300 p-2 rounded">{user.id}</p>
          </div>
          <div>
            <label className="block mb-1 font-medium">Tên:</label>
            <p className="border border-gray-300 p-2 rounded">{user.name}</p>
          </div>
          <div>
            <label className="block mb-1 font-medium">Email:</label>
            <p className="border border-gray-300 p-2 rounded">{user.email}</p>
          </div>
        </div>

        {/* Nút đăng xuất */}
        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default ProfileUser;
