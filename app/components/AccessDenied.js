import React from "react";

function AccessDenied() {
  return (
    <div class="flex bg-transparent h-96 mx-auto items-center justify-center text-sm shadow-sm">
      <svg
        viewBox="0 0 24 24"
        class="w-8 h-8 text-red-500 stroke-current"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 8V12V8ZM12 16H12.01H12ZM21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>
      <div class="ml-3">
        <div class="font-bold text-left text-red-500">Access denied</div>
        <div class="w-full text-gray-100 mt-1">
          You don&#x27;t have access to this page.
        </div>
      </div>
    </div>
  );
}

export default AccessDenied;
