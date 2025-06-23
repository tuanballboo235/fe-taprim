import React from 'react';
import { FaFacebookF, FaPhone, FaUsers } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';

const ContactCard = ({
  facebookUrl,
  zaloUrl,
  phoneNumber,
  fbGroupUrl,
}) => {
  return (
    <div className="max-w-sm mx-auto bg-gray-200 rounded-2xl shadow-md p-6 text-center space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Liên hệ Shop MMO</h2>

      <div className="flex flex-col items-center gap-3">
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-blue-600 hover:underline"
        >
          <FaFacebookF /> Facebook cá nhân
        </a>

        <a
          href={zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-blue-500 hover:underline"
        >
          <SiZalo /> Chat Zalo
        </a>

        <div className="flex items-center gap-2 text-gray-700">
          <FaPhone /> {phoneNumber}
        </div>

        <a
          href={fbGroupUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-purple-600 hover:underline"
        >
          <FaUsers /> Page Facebook
        </a>
      </div>
    </div>
  );
};

export default ContactCard;
