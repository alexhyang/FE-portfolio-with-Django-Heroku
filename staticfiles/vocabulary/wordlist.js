$(function () {
  const listId = $("#list-id").text();
  renderPage(`/vocabulary-app/lists/${listId}/`);
});
