import { useRouteError } from "react-router-dom";
import React from "react";
const ErrorBoundary = () => {
  const error = useRouteError();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-red-600">Oops! Something went wrong.</h1>
      <p className="text-lg text-gray-700">{error.statusText || error.message}</p>
    </div>
  );
};

export default ErrorBoundary;