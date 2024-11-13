// Lấy các modal và nút đóng
const modals = {
  edit: document.getElementById("editAccountModal"),
  add: document.getElementById("addAccountModal"),
};
const closeModalBtn = document.querySelector(".close");

// Mở modal theo loại (edit hoặc add)
function openModal(type) {
  modals[type].style.display = "block";
}

// Đóng tất cả modal
function closeModal() {
  Object.values(modals).forEach((modal) => (modal.style.display = "none"));
}

// Sự kiện đóng modal khi nhấn vào nút 'x'
closeModalBtn.onclick = closeModal;

// Đóng modal khi nhấn ngoài modal
window.onclick = function (event) {
  if (Object.values(modals).includes(event.target)) closeModal();
};

// Sự kiện mở modal khi nhấn vào các nút hoặc icon
document
  .getElementById("edit")
  .addEventListener("click", () => openModal("edit"));
document
  .getElementById("btnShowAdd")
  .addEventListener("click", () => openModal("add"));
