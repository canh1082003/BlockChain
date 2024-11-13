("use strict");

// Khởi tạo Web3 và accountManager toàn cục
let accountManager;
let web3;

// Hàm khởi tạo contract và Web3
async function initContract() {
  const contractAddress = "0xDa12287D24De8D5dD094ab9c17BBdD1AC7Dda9A4";

  const abi = [
    {
      inputs: [
        {
          internalType: "string",
          name: "_name",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "_age",
          type: "uint256",
        },
      ],
      name: "createAccount",
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
      inputs: [
        {
          internalType: "string",
          name: "_name",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "_age",
          type: "uint256",
        },
      ],
      name: "updateAccount",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "accountAddresses",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "accounts",
      outputs: [
        {
          internalType: "string",
          name: "name",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "age",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "walletAddress",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_walletAddress",
          type: "address",
        },
      ],
      name: "getAccount",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getAccountAddresses",
      outputs: [
        {
          internalType: "address[]",
          name: "",
          type: "address[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getAllAccounts",
      outputs: [
        {
          components: [
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "age",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "walletAddress",
              type: "address",
            },
          ],
          internalType: "struct AccountManager.Account[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

  if (typeof window.ethereum !== "undefined") {
    web3 = new Web3(window.ethereum);
    accountManager = new web3.eth.Contract(abi, contractAddress);

    console.log(
      "Contract initialized",
      accountManager.methods.getAllAccounts().call()
    );
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
        return accounts[0];
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

async function createAccount() {
  await ensureContractInitialized();
  const account = await getCurrentAccount();
  const name = document.getElementById("name").value;
  const age = parseInt(document.getElementById("age").value, 10);
  console.log("Account:", account);
  console.log("Name:", name);
  console.log("Age:", age);
  if (account && name && !isNaN(age)) {
    try {
      await accountManager.methods
        .createAccount(name, age)
        .send({ from: account });
      console.log("Account created");
      getAllAccounts();
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

  // Lấy tất cả các tài khoản
  // async function getAllAccounts() {
  //   await ensureContractInitialized();

  //   try {
  //     const accounts = await accountManager.methods.getAllAccounts().call();
  //     console.log("All Accounts:", accounts);

  //     // Kiểm tra sự tồn tại của phần tử bảng
  //     const accountsListContainer = document.getElementById(
  //       "accountsListContainer"
  //     );
  //     if (!accountsListContainer) {
  //       console.error("Không tìm thấy phần tử accountsListContainer.");
  //       return;
  //     }

  //     // Xóa dữ liệu cũ trong bảng
  //     accountsListContainer.innerHTML = "";

  //     // Duyệt qua các tài khoản và thêm vào bảng
  //     accounts.forEach((account, index) => {
  //       const row = document.createElement("tr");

  //       // Tạo nội dung cho mỗi dòng
  //       row.innerHTML = `
  //         <td>${account.name}</td>
  //         <td class="text-center">${account.age}</td>
  //         <td class="text-center">${account.walletAddress}</td>
  //         <td><button id="editButton${index}">Edit</button></td>
  //       `;

  //       // Thêm dòng vào bảng
  //       accountsListContainer.appendChild(row);

  //       // Kiểm tra sự tồn tại của nút Edit và gán sự kiện onclick
  //       const editButton = document.getElementById(`editButton${index}`);
  //       if (editButton) {
  //         editButton.onclick = function () {
  //           editAccount(index);
  //         };
  //       } else {
  //         console.error(`Không tìm thấy nút Edit cho tài khoản ${index}`);
  //       }
  //     });
  //   } catch (error) {
  //     console.error("Error fetching all accounts:", error);
  //   }
  // }
}
// async function getAllAccounts() {
//   await ensureContractInitialized();
//   console.log(accountManager.methods.getAllAccounts().call());
//   try {
//     const accounts = await accountManager.methods.getAllAccounts().call();
//     const accountsListContainer = document.getElementById(
//       "accountsListContainer"
//     );
//     if (!accountsListContainer) {
//       console.error("Không tìm thấy phần tử accountsListContainer.");
//       return;
//     }

//     if (accounts.length === 0) {
//       accountsListContainer.innerHTML = "No accounts found.";
//       return;
//     }

//     accountsListContainer.innerHTML = "";

//     const tableBody = document.createElement("tbody");
//     accounts.forEach((account, index) => {
//       const row = document.createElement("tr");
//       account.id = index; // Assign unique ID to each account object
//       row.innerHTML = `
//         <td>${account.name}</td>
//         <td class="text-center">${account.age}</td>
//         <td class="text-center">${account.walletAddress}</td>
//       `;
//       tableBody.appendChild(row);
//     });
//     accountsListContainer.appendChild(tableBody);

//     accountsListContainer.addEventListener("click", function (event) {
//       if (event.target.id.startsWith("editButton")) {
//         const index = parseInt(event.target.id.slice(10), 10);
//         editAccount(index);
//       } else if (event.target.id.startsWith("deleteButton")) {
//         const index = parseInt(event.target.id.slice(12), 10);
//         deleteAccountAtIndex(index);
//       }
//     });
//   } catch (error) {
//     console.error("Error fetching all accounts:", error);
//     // Display user-friendly error message based on error type (optional)
//   }
// }
async function getAllAccounts() {
  await ensureContractInitialized();

  try {
    const accounts = await accountManager.methods.getAllAccounts().call();
    const accountsListContainer = document.getElementById(
      "accountsListContainer"
    );

    if (!accountsListContainer) {
      console.error("Không tìm thấy phần tử accountsListContainer.");
      return;
    }

    // Nếu không có tài khoản nào, hiển thị thông báo
    if (accounts.length === 0) {
      accountsListContainer.innerHTML =
        "<tr><td colspan='3' class='text-center'>No accounts found.</td></tr>";
      return;
    }

    // Xóa nội dung cũ
    accountsListContainer.innerHTML = "";

    // Tạo các hàng mới từ danh sách tài khoản
    accounts.forEach((account, index) => {
      const row = document.createElement("tr");

      // Tạo nội dung cho hàng
      row.innerHTML = `
        <td>${account.name}</td>
        <td class="text-center">${account.age}</td>
        <td class="text-center">${account.walletAddress}</td>
        <td style="width: 20%">
          <a href="#" id="editButton${index}" class="table-link text-info">
            <span class="fa-stack">
              <i class="fa fa-square fa-stack-2x"></i>
              <i id="edit" class="fa fa-pencil fa-stack-1x fa-inverse"></i>
            </span>
          </a>
          <a href="#" id="deleteButton${index}" class="table-link danger">
            <span class="fa-stack">
              <i class="fa fa-square fa-stack-2x"></i>
              <i class="fa fa-trash-o fa-stack-1x fa-inverse"></i>
            </span>
          </a>
        </td>
      `;
      // Thêm hàng vào `accountsListContainer`
      accountsListContainer.appendChild(row);
    });
    accountsListContainer.addEventListener("click", function (event) {
      document
        .getElementById("edit")
        .addEventListener("click", () => openModal("edit"));
    });

    // Sự kiện cho nút sửa và xóa
    // accountsListContainer.addEventListener("click", function (event) {
    //   if (
    //     event.target.closest("a") &&
    //     event.target.closest("a").id.startsWith("editButton")
    //   ) {
    //     const index = parseInt(event.target.closest("a").id.slice(10), 10);
    //     editAccount(index);
    //   } else if (
    //     event.target.closest("a") &&
    //     event.target.closest("a").id.startsWith("deleteButton")
    //   ) {
    //     const index = parseInt(event.target.closest("a").id.slice(12), 10);
    //     deleteAccountAtIndex(index);
    //   }
    // });
  } catch (error) {
    console.error("Error fetching all accounts:", error);
  }
}

window.onload = async function () {
  await initContract();
  await getAllAccounts(); // Call the function to fetch and display all accounts
};
