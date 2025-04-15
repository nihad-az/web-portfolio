const pfp = document.getElementById("profile-picture");
const body = document.body;

pfp.addEventListener("click", function () {
  const div = document.createElement("div");
  div.style.position = "absolute";
  div.style.backgroundColor = "rgba(0, 0, 0, 0.85)";
  div.style.width = "100%";
  div.style.height = "100%";
  div.style.top = "0";
  div.style.left = "0";

  const img = document.createElement("img");
  img.src = pfp.src;
  img.style.width = "12.5rem";
  img.style.height = "12.5rem";
  img.style.borderRadius = "100%";
  img.style.position = "absolute";
  img.style.top = "50%";
  img.style.left = "50%";
  img.style.transform = "translate(-50%, -50%)";

  body.style.position = "relative";

  document.body.appendChild(div);
  div.appendChild(img);

  div.addEventListener("click", function () {
    div.remove();
    body.style.position = "static";
  });
});
