import React from "react";

const Loader = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black/70 backdrop-blur-3xl  ">
      <div className="flex items-center space-x-2">
        <span className="h-6 w-6 animate-bounce rounded-full bg-indigo-500 [animation-delay:0ms]"></span>
        <span className="h-6 w-6 animate-bounce rounded-full bg-indigo-500 [animation-delay:150ms]"></span>
        <span className="h-6 w-6 animate-bounce rounded-full bg-indigo-500 [animation-delay:300ms]"></span>
      </div>
    </div>
  );
};

export default Loader;
