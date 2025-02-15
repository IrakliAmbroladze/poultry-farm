import Link from "next/link";
import React from "react";

const Profile = () => {
  return (
    <div className="flex h-lvh items-center justify-center">
      <Link href={"/set-password"}>set password</Link>
    </div>
  );
};

export default Profile;
