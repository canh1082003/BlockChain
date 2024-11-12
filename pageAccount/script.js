("use strict");

// Khởi tạo Web3 và accountManager toàn cục
let accountManager;
let web3;

// Hàm khởi tạo contract và Web3
async function initContract() {
  const contractAddress = "0x540d7E428D5207B30EE03F2551Cbb5751D3c7569";
  const abi = [
    {
      inputs: [
        { internalType: "string", name: "_name", type: "string" },
        { internalType: "uint256", name: "_age", type: "uint256" },
      ],
      name: "createAccount",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_walletAddress", type: "address" },
      ],
      name: "getAccount",
      outputs: [
        { internalType: "string", name: "", type: "string" },
        { internalType: "uint256", name: "", type: "uint256" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "string", name: "_name", type: "string" },
        { internalType: "uint256", name: "_age", type: "uint256" },
      ],
      name: "updateAccount",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "deleteAccount",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "", type: "address" }],
      name: "accounts",
      outputs: [
        { internalType: "string", name: "name", type: "string" },
        { internalType: "uint256", name: "age", type: "uint256" },
        { internalType: "address", name: "walletAddress", type: "address" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "getAllAccounts",
      outputs: [
        {
          name: "",
          type: "tuple[]",
          components: [
            {
              name: "name",
              type: "string",
            },
            {
              name: "age",
              type: "uint256",
            },
            {
              name: "walletAddress",
              type: "address",
            },
          ],
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
  ];

  if (typeof window.ethereum !== "undefined") {
    web3 = new Web3(window.ethereum);
    accountManager = new web3.eth.Contract(abi, contractAddress);
    console.log("Contract initialized");
  } else {
    console.error("Web3 not detected. Please install MetaMask.");
  }
}

async function ensureContractInitialized() {
  if (!accountManager) {
    await initContract();
  }
}
async function getCurrentAccount() {
  if (typeof window.ethereum !== "undefined") {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length > 0) {
        return accounts[0]; // Trả về tài khoản hiện tại
      } else {
        alert("No account found. Please connect your MetaMask.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching account:", error);
      alert("Error fetching account");
      return null;
    }
  } else {
    alert("Please install MetaMask!");
    return null;
  }
}

//     try {
//       // Yêu cầu người dùng cấp quyền truy cập tài khoản
//       const accounts = await window.ethereum.request({
//         method: "eth_requestAccounts",
//       });

//       // Kiểm tra xem có tài khoản nào không
//       const account = accounts[0];
//       console.log("Connected account:", account); // Xem giá trị của account

//       if (account) {
//         document.getElementById(
//           "page-actions"
//         ).innerHTML = `Connected: ${account}`;
//         const toast = document.getElementById("toastSuccess");
//         toast.style.display = "block";
//         setTimeout(() => {
//           toast.style.display = "none";
//         }, 5000);
//         document.getElementById("btn_manage").style.display = "inline-block";
//         return account;
//       } else {
//         alert("No account found.");
//         return null;
//       }
//     } catch (error) {
//       console.error("User denied account connection", error);
//       alert("User denied account connection");
//       return null;
//     }
//   } else {
//     alert("Please install MetaMask!");
//     return null;
//   }
// }

// Tạo tài khoản mới
async function createAccount() {
  await ensureContractInitialized();
  const account = await getCurrentAccount();
  const name = document.getElementById("name").value;
  const age = parseInt(document.getElementById("age").value, 10);
  console.log("Account:", account); // Kiểm tra giá trị của account
  console.log("Name:", name); // Kiểm tra giá trị của name
  console.log("Age:", age);
  if (account && name && !isNaN(age)) {
    try {
      await accountManager.methods
        .createAccount(name, age)
        .send({ from: account });
      console.log("Account created");
    } catch (error) {
      console.error("Error creating account:", error);
      alert("Error creating account");
    }
  } else {
    alert("Invalid account, name or age");
  }
}

// Lấy thông tin tài khoản
async function getAccount() {
  await ensureContractInitialized();
  const account = await connectMetaMask();
  if (account) {
    try {
      const result = await accountManager.methods.getAccount(account).call();
      console.log("Account Info:", result);
    } catch (error) {
      console.error("Error fetching account:", error);
    }
  }
}

// Cập nhật tài khoản
async function updateAccount() {
  await ensureContractInitialized();
  const account = await connectMetaMask();
  const name = document.getElementById("name").value;
  const age = parseInt(document.getElementById("age").value, 10);
  if (account && name && !isNaN(age)) {
    try {
      await accountManager.methods
        .updateAccount(name, age)
        .send({ from: account });
      console.log("Account updated");
    } catch (error) {
      console.error("Error updating account:", error);
      alert("Error updating account");
    }
  } else {
    alert("Invalid account, name or age");
  }
}

// Xóa tài khoản
async function deleteAccount() {
  await ensureContractInitialized();
  const account = await connectMetaMask();
  if (account) {
    try {
      await accountManager.methods.deleteAccount().send({ from: account });
      console.log("Account deleted");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Error deleting account");
    }
  }
}

// async function getAllAccount() {
//   // Kết nối với Web3 (dùng window.ethereum cho MetaMask)
//   if (typeof window.ethereum !== "undefined") {
//     const web3 = new Web3(window.ethereum);
//     await window.ethereum.enable(); // Yêu cầu quyền truy cập tài khoản từ MetaMask
//   } else {
//     alert("MetaMask không được cài đặt!");
//     return;
//   }

//   // Địa chỉ của Smart Contract và ABI của nó
//   const contractAddress = "0x540d7E428D5207B30EE03F2551Cbb5751D3c7569"; // Thay bằng địa chỉ contract của bạn
//   const contractABI = [
//     {
//       inputs: [
//         { internalType: "string", name: "_name", type: "string" },
//         { internalType: "uint256", name: "_age", type: "uint256" },
//       ],
//       name: "createAccount",
//       outputs: [],
//       stateMutability: "nonpayable",
//       type: "function",
//     },
//     {
//       inputs: [
//         { internalType: "address", name: "_walletAddress", type: "address" },
//       ],
//       name: "getAccount",
//       outputs: [
//         { internalType: "string", name: "", type: "string" },
//         { internalType: "uint256", name: "", type: "uint256" },
//       ],
//       stateMutability: "view",
//       type: "function",
//     },
//     {
//       inputs: [
//         { internalType: "string", name: "_name", type: "string" },
//         { internalType: "uint256", name: "_age", type: "uint256" },
//       ],
//       name: "updateAccount",
//       outputs: [],
//       stateMutability: "nonpayable",
//       type: "function",
//     },
//     {
//       inputs: [],
//       name: "deleteAccount",
//       outputs: [],
//       stateMutability: "nonpayable",
//       type: "function",
//     },
//     {
//       inputs: [{ internalType: "address", name: "", type: "address" }],
//       name: "accounts",
//       outputs: [
//         { internalType: "string", name: "name", type: "string" },
//         { internalType: "uint256", name: "age", type: "uint256" },
//         { internalType: "address", name: "walletAddress", type: "address" },
//       ],
//       stateMutability: "view",
//       type: "function",
//     },
//   ];

//   // Khởi tạo contract
//   const contract = new web3.eth.Contract(contractABI, contractAddress);

//   try {
//     // Gọi hàm getAllAccounts từ smart contract
//     const accounts = await contract.methods.getAllAccounts().call();

//     // Gọi hàm loadAccounts() để hiển thị danh sách tài khoản trong bảng
//     loadAccounts(accounts);
//   } catch (error) {
//     console.error("Lỗi khi lấy dữ liệu từ contract:", error);
//   }
// }

window.onload = initContract;
