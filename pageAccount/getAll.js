"use strict";
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
];
if (typeof window.ethereum !== "undefined") {
  web3 = new Web3(window.ethereum);
  accountManager = new web3.eth.Contract(abi, contractAddress);
  console.log(accountManager);
  console.log("Contract initialized");
} else {
  console.error("Web3 not detected. Please install MetaMask.");
}
console.log("window.ethereum:", window.ethereum);
console.log("accountManager.methods:", accountManager.methods.getAllAccounts());

async function displayAllAccounts() {
  try {
    const accounts = await accountManager.methods.getAllAccounts().call();
    if (accounts.length === 0) {
      console.warn("No accounts found.");
      return;
    }
    console.log(accounts);
    // Lấy phần tử tbody trong HTML
    const accountsListContainer = document.getElementById(
      "accountsListContainer"
    );

    // Xóa tất cả các dòng cũ trong bảng
    accountsListContainer.innerHTML = "";

    // Duyệt qua các tài khoản và thêm vào bảng
    accounts.forEach((account) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                // <td class="text-center">${account.name}</td>
                // <td class="text-center">${account.age}</td>
                // <td class="text-center">
                //     <a href="#">${account.walletAddress}</a>
                // </td>
                <td class="text-center">${account[0]}</td> <!-- Tên -->
        <td class="text-center">${account[1]}</td> <!-- Tuổi -->
        <td class="text-center">
          <a href="#">${address}</a>
        </td>
                <td style="width: 20%">
                    <a href="#" class="table-link text-info">
                        <span class="fa-stack">
                            <i class="fa fa-square fa-stack-2x"></i>
                            <i id="edit" class="fa fa-pencil fa-stack-1x fa-inverse"></i>
                        </span>
                    </a>
                    <a href="#" class="table-link danger">
                        <span class="fa-stack">
                            <i class="fa fa-square fa-stack-2x"></i>
                            <i class="fa fa-trash-o fa-stack-1x fa-inverse"></i>
                        </span>
                    </a>
                </td>
            `;
      accountsListContainer.appendChild(row);
    });
  } catch (error) {
    console.error("Lỗi khi gọi getAllAccounts:", error);
  }
}

displayAllAccounts();
