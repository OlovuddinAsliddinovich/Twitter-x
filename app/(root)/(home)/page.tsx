import AuthPage from "@/components/auth";
import React from "react";

const HomePage = () => {
  const user = false;
  if (!user) return (
    <div className="container max-w-7xl h-screen mx-auto px-4">
      <AuthPage />
    </div>
  );

  return <div>HomePage</div>;
};

export default HomePage;
