export default function formatTime(time: string) {
  // Remove leading zeros and format as H:MM instead of HH:MM:SS
  const parts = time.split(':');
  const hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  
  if (hours === 0) {
    return `${parseInt(minutes, 10)}:${parts[2]}`;
  }
  return `${hours}:${minutes}`;
};