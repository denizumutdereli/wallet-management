# Crypto HD Wallet Management System

## Overview

This project is an extensive API model developed in TypeScript for managing Crypto HD Wallets, utilizing TatumIO for custodial type services. It strictly adheres to the BIP44 standard and uses mnemonics for seeding wallets. The system features a domain-specific namespace for creating main HD wallets attached to domains. Data storage is handled by MongoDB with encryption for security.

## Key Features

- **BIP39 Mnemonic Support**: Implements BIP39 for mnemonic generation, providing a secure and memorable way to seed wallets.
- **Domain-Specific Namespace**: Supports creating main HD wallets and associating them with specific domains.
- **MongoDB with Encrypted Format**: Uses MongoDB for data storage, ensuring data is stored in an encrypted format.
- **User-Wallet Indexing**: Employs indexing for HD wallets, allowing the creation of multiple wallets for users on each network.
- **Configurable Network Support**: Capable of handling multiple networks with configurable main seeder accounts through a configuration file.
- **Extensibility**: Includes additional features like balance checking and deposit collection over TatumIO, and integration with full node deposit listeners and HashiCorp Vault systems. These features are currently disabled and commented out for demo purposes but can be easily activated for real-world applications.

## Getting Started

### Prerequisites

- Node
- TypeScript
- MongoDB
- Access to TatumIO API

### Installation

1. Clone the repository:
   git clone [repository-url]
2. Navigate to the project directory:
   cd [project-name]
3. Install dependencies:
   npm install
4. Set up the necessary environment variables in a `.env` file.
5. Start the application:
   npm start

## Configuration

Modify `config.json` to configure main seeder accounts and enable/disable specific network functionalities.

## Usage

Provide examples and instructions for generating wallets, attaching wallets to domains, and other functionalities.

## Advanced Features

There are disabled features like balance checking, deposit collection, full node deposit listeners, and HashiCorp Vault integration, can be activated by uncommenting.

## Ethereum-Based Smart Contract for Deposit Checking

The system includes Ethereum-based smart contract functionality for deposit checking. This feature allows the system to monitor and verify deposits made to Ethereum wallets, crucial for transaction validation in Ethereum and ERC-20 token transactions.

- **Smart Contract Integration**: Seamlessly integrates with Ethereum smart contracts to automate the process of checking and verifying wallet deposits.
- **Real-Time Monitoring**: Provides real-time monitoring capabilities for deposits, ensuring timely and accurate transaction validation.

## Contact

For inquiries or suggestions, please contact [@denizumutdereli](https://www.linkedin.com/in/denizumutdereli).

## Additional Notes for creating wallets without 3rd party support

### Bitcoin Wallet Creation

- **ECDSA and secp256k1**: Bitcoin wallets use the Elliptic Curve Digital Signature Algorithm (ECDSA) with the secp256k1 curve. A private key is generated as a random number, and the corresponding public key is derived from it. The secp256k1 curve is defined specifically for Bitcoin. [More on secp256k1](https://en.bitcoin.it/wiki/Secp256k1)
- **SHA-256 and RIPEMD-160 Hashing**: The public key undergoes two hashing processes. First, it is hashed using SHA-256, and then the result is hashed using RIPEMD-160. [SHA-256 Wiki](https://en.wikipedia.org/wiki/SHA-2), [RIPEMD-160 Wiki](https://en.wikipedia.org/wiki/RIPEMD)
- **Base58Check Encoding**: The final hash is encoded using Base58Check, providing a human-readable address that is less prone to errors. Base58Check encoding adds a checksum and version byte for error-checking and to indicate address type. Simply to increase readability replace uppercase O, I and lowercase l. [Base58Check Wiki](https://en.wikipedia.org/wiki/Base58)

### Ethereum Wallet Creation

- **ECDSA and secp256k1**: Ethereum also uses ECDSA with the secp256k1 curve. Despite using the same curve as Bitcoin, Ethereum employs a different hashing algorithm.
- **Keccak-256 / SHA-3 Hashing**: Ethereum uses the Keccak-256 hash function, a variant of SHA-3, on the public key. This is distinct from Bitcoin's use of SHA-256 and RIPEMD-160. [Keccak Wiki](https://en.wikipedia.org/wiki/SHA-3)
- **Address Formation**: Ethereum addresses are formed from the last 20 bytes of the Keccak-256 hash, providing a unique identifier. This format is more compact and is typically represented in hexadecimal, prefixed with '0x'.

### More about encryption algorithms

- **Good to know**: SHA-2 vs SHA3 Merkle-Sponge funcs, what is bit shifting, Elliptic functions as trigonometry and cubic equations y²=x³+ax+b 

## Using Asymmetric Keys with Rotated Tokens via HashiCorp Vault

### Overview

Integrating asymmetric key management with token rotation using HashiCorp Vault enhances the security of cryptographic operations in the system. HashiCorp Vault is a tool for securely accessing secrets, such as tokens, passwords, certificates, and encryption keys.

### Key Management

- **Asymmetric Keys**: The system uses asymmetric cryptography (public and private keys) for secure transactions. Public keys are used to encrypt data or verify signatures, while private keys decrypt data or create signatures.
- **Vault for Key Storage**: HashiCorp Vault securely stores and manages access to private keys, ensuring they are protected and only accessible by authorized entities.

### Rotating Tokens with HashiCorp Vault

- **Token Rotation**: For enhanced security, the system implements a token rotation policy using HashiCorp Vault. Rotating tokens minimizes the risk associated with token compromise.
- **Automated Process**: The rotation of tokens is automated within Vault, ensuring that old tokens are replaced with new ones at regular intervals or based on specific security policies.
- **Access Control**: HashiCorp Vault manages permissions and access control, ensuring that only authorized applications and users can access the rotated tokens.

### Integration Steps

1. **Vault Setup**: Set up a HashiCorp Vault server and configure its storage backend.
2. **Key Generation**: Generate asymmetric key pairs and store the private key securely in the Vault.
3. **Configure Token Rotation**: Set up a token rotation policy in Vault to regularly rotate authentication tokens.
4. **Access Management**: Configure access policies in Vault to control which applications or services can retrieve the rotated tokens and private keys.
5. **API Integration**: Integrate the Vault APIs in your application to programmatically retrieve rotated tokens and access private keys for cryptographic operations.

### Best Practices

- Regularly review and update access policies in HashiCorp Vault.
- Monitor and audit token usage and access logs to detect any unauthorized access.
- Keep the Vault software up to date with the latest security patches.

For more detailed guidance, refer to the [HashiCorp Vault documentation](https://www.vaultproject.io/docs).

Integrating HashiCorp Vault for managing asymmetric keys and implementing token rotation adds an essential layer of security, crucial for the management of sensitive cryptographic operations in the Crypto HD Wallet Management System.

