export const formatDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const day = now.getDay();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const week = ["日", "月", "火", "水", "木", "金", "土"][day];
  
    return `${year}/${month}/${date}(${week}) ${hours}:${minutes}`;
};
