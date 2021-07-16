$(function () {
  const listId = $("#list-id").text();
  loadPage(`/app/lists/${listId}/`);
});

