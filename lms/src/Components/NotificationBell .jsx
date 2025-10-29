import React, { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import { getNotificationCount } from './notificationsApi';

const NotificationBell = ({ username, role, onClick }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    async function fetchCount() {
      setCount(await getNotificationCount(username, role));
    }
    if (username) {
      fetchCount();
      const interval = setInterval(fetchCount, 20000); // polling
      return () => clearInterval(interval);
    }
  }, [username, role]);
  return (
    <div className="relative">
      <button onClick={onClick} className="p-2 rounded-full hover:bg-gray-200 relative" title={`${count} unread`}>
        <FaBell className={`text-xl ${count > 0 ? "text-blue-600" : "text-gray-600"}`} />
        {count > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center">{count}</span>}
      </button>
    </div>
  );
};
export default NotificationBell;
