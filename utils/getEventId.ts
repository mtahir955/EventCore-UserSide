export const getEventId = (passedId?: string | null) => {
  return (
    passedId ||
    localStorage.getItem("editEventId") ||
    localStorage.getItem("publishedEventId") ||
    localStorage.getItem("lastPublishedEventId") ||
    null
  );
};
