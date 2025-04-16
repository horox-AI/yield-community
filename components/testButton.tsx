
"use client "

import React from 'react';

const testButton = () => {
  const handleClick = () => {
    console.log('Simple Button Clicked');
  };

  return (
    <button onClick={handleClick} 
       className="sticky top-6 flex flex-col items-center text-center w-14 h-14 px-1 py-3 rounded border border-slate-700 bg-gradient-to-tr from-slate-800/20 via-slate-800/50 to-slate-800/20 hover:bg-slate-800 transition duration-150 ease-in-out">
     <svg className="inline-flex fill-indigo-400 mb-1" width="11" height="7" xmlns="http://www.w3.org/2000/svg">
       <path d="M1.664 6.747.336 5.253 5.5.662l5.164 4.591-1.328 1.494L5.5 3.338z" />
     </svg>
     
    </button>
  );
};

export default testButton;
