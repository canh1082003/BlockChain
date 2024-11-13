// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

contract AccountManager {
    struct Account {
        string name;
        uint age;
        address walletAddress;
    }

    mapping(address => Account) public accounts;
    address[] public accountAddresses;

    // Tạo tài khoản mới
    function createAccount(string memory _name, uint _age) public {
        require(accounts[msg.sender].walletAddress == address(0), "Account already exists");
        accounts[msg.sender] = Account(_name, _age, msg.sender);
        accountAddresses.push(msg.sender); // Thêm địa chỉ vào danh sách khi tạo tài khoản mới
    }

    // Đọc thông tin tài khoản
    function getAccount(address _walletAddress) public view returns (string memory, uint) {
        Account memory account = accounts[_walletAddress];
        return (account.name, account.age);
    }

    // Cập nhật tài khoản
    function updateAccount(string memory _name, uint _age) public {
        require(accounts[msg.sender].walletAddress != address(0), "Account does not exist");
        accounts[msg.sender].name = _name;
        accounts[msg.sender].age = _age;
    }

    // Xoá tài khoản
    function deleteAccount() public {
        require(accounts[msg.sender].walletAddress != address(0), "Account does not exist");

        // Xoá tài khoản khỏi mapping
        delete accounts[msg.sender];

        // Tìm và xoá tài khoản khỏi mảng accountAddresses
        uint index = findAccountIndex(msg.sender);
        if (index < accountAddresses.length) {
            accountAddresses[index] = accountAddresses[accountAddresses.length - 1]; // Đưa phần tử cuối cùng vào vị trí vừa xóa
            accountAddresses.pop(); // Xoá phần tử cuối cùng
        }
    }

    // Hàm tìm kiếm chỉ số của tài khoản trong mảng
    function findAccountIndex(address _accountAddress) internal view returns (uint) {
        for (uint i = 0; i < accountAddresses.length; i++) {
            if (accountAddresses[i] == _accountAddress) {
                return i;
            }
        }
        revert("Account not found");
    }

    // Lấy thông tin của tất cả các tài khoản
    function getAllAccounts() public view returns (Account[] memory) {
        uint accountCount = accountAddresses.length;
        Account[] memory allAccounts = new Account[](accountCount);
        
        for (uint i = 0; i < accountCount; i++) {
            allAccounts[i] = accounts[accountAddresses[i]];
        }
        
        return allAccounts;
    }

    // Lấy danh sách địa chỉ các tài khoản
    function getAccountAddresses() public view returns (address[] memory) {
        return accountAddresses;
    }
}
