$(function () {
  const listId = $("#list-id").text();
  load_page(`/app/lists/${listId}/`);
});

