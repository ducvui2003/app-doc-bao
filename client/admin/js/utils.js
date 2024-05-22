function formatDate(dateString) {
  var formattedDate = new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return formattedDate;
}
export { formatDate };
