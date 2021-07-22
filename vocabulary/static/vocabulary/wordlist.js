$(function () {
  const listId = $("#list-id").text();
  loadPage(`/vocabulary-app/lists/${listId}/`);
});

