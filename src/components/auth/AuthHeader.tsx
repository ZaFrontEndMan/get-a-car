
import React from 'react';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
        {title}
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        {subtitle}
      </p>
    </div>
  );
};

export default AuthHeader;
