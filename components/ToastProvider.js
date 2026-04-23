'use client';

import { ToastContainer } from 'react-toastify';

export default function ToastProvider() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3500}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      toastClassName="!rounded-xl !text-sm !font-semibold !shadow-lg"
    />
  );
}
