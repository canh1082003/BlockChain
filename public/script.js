"use strict";
async function connectMetaMask() {
  if (typeof window.ethereum !== "undefined") {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected account:", accounts[0]);
      document.getElementById(
        "page-actions"
      ).innerHTML = `Connected: ${accounts[0]}`;
      const toast = document.getElementById("toastSuccess");
      toast.style.display = "block";
      setTimeout(() => {
        toast.style.display = "none";
      }, 5000);
      document.getElementById("btn_manage").style.display = "inline-block";
      return accounts[0];
    } catch (error) {
      console.error("User rejected connection", error);
    }
  } else {
    alert("Please install MetaMask!");
  }
}
function redirectToManage() {
  window.location.href = "http://127.0.0.1:5500/pageAccount/index.html";
}
