export const formatFullname = (fullname?: string) => {
  if (!fullname) {
    return "";
  }
  const parts = fullname.trim().split(/\s+/).filter(Boolean);
  if (parts.length < 2) {
    return parts.join(" ");
  }
  const [firstName, lastName] = parts;
  return [lastName, firstName].join(" ");
};
