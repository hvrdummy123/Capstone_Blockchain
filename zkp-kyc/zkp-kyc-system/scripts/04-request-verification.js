// // const { ethers } = require("hardhat");
// // const Utils = require("../src/utils");
// // const fs = require("fs");
// // const path = require("path");

// // async function requestVerifications() {
// //     console.log("🏢 Company: Requesting Age Verifications\n");

// //     try {
// //         // Load deployment and user data
// //         const deploymentsPath = path.join(__dirname, '../deployments.json');
// //         const deployments = JSON.parse(fs.readFileSync(deploymentsPath, 'utf-8'));
        
// //         const userDataPath = path.join(__dirname, '../userData.json');
// //         const userData = JSON.parse(fs.readFileSync(userDataPath, 'utf-8'));

// //         const [aadhaarOrg, alice, bob, company] = await ethers.getSigners();
        
// //         // Get contract instances
// //         const { over18Verifier } = await Utils.getContracts(
// //             deployments.attesterContract,
// //             deployments.over18Verifier
// //         );

// //         console.log("🏢 Company requesting verifications from users...\n");

// //         // Request verification for Alice
// //         console.log("📨 Requesting verification for Alice...");
// //         console.log(`   Company: ${Utils.formatAddress(company.address)}`);
// //         console.log(`   User: ${Utils.formatAddress(alice.address)}`);
        
// //         const verificationFee = ethers.parseEther("0.001");
        
// //         const aliceRequestTx = await over18Verifier.connect(company).requestVerification(
// //             alice.address,
// //             { value: verificationFee }
// //         );
        
// //         const aliceReceipt = await Utils.waitForTransaction(aliceRequestTx, "Alice verification request");
        
// //         // --- CORRECTED EVENT PARSING ---
// //         // Find the event in the receipt's 'events' array
// //         const aliceRequestEvent = aliceReceipt.events?.find(event => event.event === 'VerificationRequested');

// //         if (!aliceRequestEvent) {
// //             throw new Error("VerificationRequested event not found for Alice's transaction.");
// //         }
        
// //         // The event arguments are already parsed
// //         const aliceRequestId = aliceRequestEvent.args.requestId;
// //         console.log(`✅ Alice verification request ID: ${aliceRequestId}`);

// //         // Request verification for Bob
// //         console.log("\n📨 Requesting verification for Bob...");
// //         console.log(`   Company: ${Utils.formatAddress(company.address)}`);
// //         console.log(`   User: ${Utils.formatAddress(bob.address)}`);
        
// //         const bobRequestTx = await over18Verifier.connect(company).requestVerification(
// //             bob.address,
// //             { value: verificationFee }
// //         );
        
// //         const bobReceipt = await Utils.waitForTransaction(bobRequestTx, "Bob verification request");
        
// //         // Extract request ID from event
// //         const bobRequestEvent = bobReceipt.logs.find(log => {
// //             try {
// //                 return over18Verifier.interface.parseLog(log).name === 'VerificationRequested';
// //             } catch (e) {
// //                 return false;
// //             }
// //         });
        
// //         const bobRequestId = over18Verifier.interface.parseLog(bobRequestEvent).args.requestId;
// //         console.log(`✅ Bob verification request ID: ${bobRequestId}`);

// //         // Save request IDs
// //         const requestData = {
// //             alice: {
// //                 requestId: aliceRequestId.toString(),
// //                 requester: company.address,
// //                 user: alice.address
// //             },
// //             bob: {
// //                 requestId: bobRequestId.toString(),
// //                 requester: company.address,
// //                 user: bob.address
// //             }
// //         };

// //         const requestDataPath = path.join(__dirname, '../requestData.json');
// //         fs.writeFileSync(requestDataPath, JSON.stringify(requestData, null, 2));

// //         console.log("\n📄 Request data saved to requestData.json");

// //         // Show pending requests for users
// //         console.log("\n📋 Checking pending requests...");
        
// //         const alicePendingRequests = await over18Verifier.getPendingRequests(alice.address);
// //         console.log(`Alice has ${alicePendingRequests.length} pending request(s): ${alicePendingRequests.join(', ')}`);
        
// //         const bobPendingRequests = await over18Verifier.getPendingRequests(bob.address);
// //         console.log(`Bob has ${bobPendingRequests.length} pending request(s): ${bobPendingRequests.join(', ')}`);

// //         console.log("\n🎉 Verification requests sent successfully!");
// //         console.log("\n📱 Users can now check their wallets for verification requests and choose to accept or reject them.");

// //     } catch (error) {
// //         console.error("❌ Error requesting verifications:", error);
// //         process.exit(1);
// //     }
// // }

// // // Run if called directly
// // if (require.main === module) {
// //     requestVerifications()
// //         .then(() => process.exit(0))
// //         .catch((error) => {
// //             console.error(error);
// //             process.exit(1);
// //         });
// // }

// // module.exports = { requestVerifications };

// const { ethers } = require("hardhat");
// const Utils = require("../src/utils");
// const fs = require("fs");
// const path = require("path");

// async function requestVerifications() {
//     console.log("🏢 Company: Requesting Age Verifications\n");

//     try {
//         // Load deployment and user data
//         const deploymentsPath = path.join(__dirname, '../deployments.json');
//         const deployments = JSON.parse(fs.readFileSync(deploymentsPath, 'utf-8'));
        
//         const userDataPath = path.join(__dirname, '../userData.json');
//         const userData = JSON.parse(fs.readFileSync(userDataPath, 'utf-8'));

//         const [aadhaarOrg, alice, bob, company] = await ethers.getSigners();
        
//         // Get BOTH contract instances
//         const { attesterContract, over18Verifier } = await Utils.getContracts(
//             deployments.attesterContract,
//             deployments.over18Verifier
//         );

//         // --- DEBUG STEP 1: Check prerequisites before sending any transactions ---
//         console.log("🕵️  Verifying prerequisites...");
//         const aliceHasCard = await attesterContract.hasValidCard(alice.address);
//         const bobHasCard = await attesterContract.hasValidCard(bob.address);

//         console.log(`   Does Alice have a valid card? ---> ${aliceHasCard}`);
//         console.log(`   Does Bob have a valid card?   ---> ${bobHasCard}`);

//         if (!aliceHasCard || !bobHasCard) {
//             console.error("\n❌ PREREQUISITE FAILED: Not all users have a valid Aadhaar card issued.");
//             console.error("   Please ensure you have run the script that calls 'issueAadhaarCard' for Alice and Bob first.");
//             process.exit(1);
//         }
//         console.log("✅ Prerequisites met. Proceeding with verification requests.\n");
//         // --- END DEBUG STEP 1 ---

//         console.log("🏢 Company requesting verifications from users...\n");

//         // Request verification for Alice
//         console.log("📨 Requesting verification for Alice...");
//         console.log(`   Company: ${Utils.formatAddress(company.address)}`);
//         console.log(`   User: ${Utils.formatAddress(alice.address)}`);
        
// const verificationFee = ethers.parseEther("0.001");        
//         const aliceRequestTx = await over18Verifier.connect(company).requestVerification(
//             alice.address,
//             { value: verificationFee }
//         );
        
//         const aliceReceipt = await Utils.waitForTransaction(aliceRequestTx, "Alice verification request");
        
//         // --- DEBUG STEP 2: Log the full receipt to inspect it ---
//         // console.log("\n🔍 Full Alice Receipt:", JSON.stringify(aliceReceipt, null, 2));
        
//         // Check transaction status from the receipt
//         if (aliceReceipt.status === 0) {
//             throw new Error("Alice's verification request transaction FAILED and was reverted.");
//         }
        
//         const aliceRequestEvent = aliceReceipt.events?.find(event => event.event === 'VerificationRequested');
        
//         if (!aliceRequestEvent) {
//             throw new Error("VerificationRequested event NOT FOUND for Alice, even though the transaction succeeded.");
//         }
        
//         const aliceRequestId = aliceRequestEvent.args.requestId;
//         console.log(`✅ Alice verification request ID: ${aliceRequestId}`);

//         // Request verification for Bob (with same debug checks)
//         console.log("\n📨 Requesting verification for Bob...");
//         const bobRequestTx = await over18Verifier.connect(company).requestVerification(
//             bob.address,
//             { value: verificationFee }
//         );
//         const bobReceipt = await Utils.waitForTransaction(bobRequestTx, "Bob verification request");

//         if (bobReceipt.status === 0) {
//             throw new Error("Bob's verification request transaction FAILED and was reverted.");
//         }

//         const bobRequestEvent = bobReceipt.events?.find(event => event.event === 'VerificationRequested');
//         if (!bobRequestEvent) {
//             throw new Error("VerificationRequested event NOT FOUND for Bob, even though the transaction succeeded.");
//         }
//         const bobRequestId = bobRequestEvent.args.requestId;
//         console.log(`✅ Bob verification request ID: ${bobRequestId}`);

//         // Save request IDs
//         const requestData = {
//             alice: { requestId: aliceRequestId.toString(), requester: company.address, user: alice.address },
//             bob: { requestId: bobRequestId.toString(), requester: company.address, user: bob.address }
//         };
//         fs.writeFileSync(path.join(__dirname, '../requestData.json'), JSON.stringify(requestData, null, 2));
//         console.log("\n📄 Request data saved to requestData.json");

//         // Show pending requests for users
//         console.log("\n📋 Checking pending requests...");
//         const alicePending = await over18Verifier.getPendingRequests(alice.address);
//         console.log(`Alice has ${alicePending.length} pending request(s): ${alicePending.join(', ')}`);
//         const bobPending = await over18Verifier.getPendingRequests(bob.address);
//         console.log(`Bob has ${bobPending.length} pending request(s): ${bobPending.join(', ')}`);

//         console.log("\n🎉 Verification requests sent successfully!");

//     } catch (error) {
//         console.error("❌ Error requesting verifications:", error);
//         process.exit(1);
//     }
// }

// if (require.main === module) {
//     requestVerifications().catch(console.error);
// }

// module.exports = { requestVerifications };

const { ethers } = require("hardhat");
const Utils = require("../src/utils");
const fs = require("fs");
const path = require("path");

async function requestVerifications() {
    console.log("🏢 Company: Requesting Age Verifications\n");

    try {
        // Load deployment and user data
        const deploymentsPath = path.join(__dirname, '../deployments.json');
        const deployments = JSON.parse(fs.readFileSync(deploymentsPath, 'utf-8'));
        
        const userDataPath = path.join(__dirname, '../userData.json');
        const userData = JSON.parse(fs.readFileSync(userDataPath, 'utf-8'));

        const [aadhaarOrg, alice, bob, company] = await ethers.getSigners();
        
        // Get BOTH contract instances
        const { attesterContract, over18Verifier } = await Utils.getContracts(
            deployments.attesterContract,
            deployments.over18Verifier
        );

        // --- Prerequisite Checks ---
        console.log("🕵️  Verifying prerequisites...");
        const aliceHasCard = await attesterContract.hasValidCard(alice.address);
        const bobHasCard = await attesterContract.hasValidCard(bob.address);

        console.log(`   Does Alice have a valid card? ---> ${aliceHasCard}`);
        console.log(`   Does Bob have a valid card?   ---> ${bobHasCard}`);

        if (!aliceHasCard || !bobHasCard) {
            throw new Error("PREREQUISITE FAILED: Not all users have a valid Aadhaar card issued.");
        }
        console.log("✅ Prerequisites met. Proceeding with verification requests.\n");
        
        console.log("🏢 Company requesting verifications from users...\n");

        // --- Request verification for Alice ---
        console.log("📨 Requesting verification for Alice...");
        console.log(`   Company: ${Utils.formatAddress(company.address)}`);
        console.log(`   User: ${Utils.formatAddress(alice.address)}`);
        
        const verificationFee = ethers.parseEther("0.001");        
        const aliceRequestTx = await over18Verifier.connect(company).requestVerification(
            alice.address,
            { value: verificationFee }
        );
        
        const aliceReceipt = await Utils.waitForTransaction(aliceRequestTx, "Alice verification request");
        
        if (aliceReceipt.status === 0) {
            throw new Error("Alice's verification request transaction FAILED and was reverted.");
        }
        
        // --- Manual Event Parsing for Alice ---
        console.log("✅ Transaction succeeded. Manually parsing event from raw logs...");
        let aliceRequestId;
        const eventSignature = "VerificationRequested(uint256,address,address,uint256)";
        const expectedTopic = ethers.id(eventSignature);

        for (const log of aliceReceipt.logs) {
            if (log.address === deployments.over18Verifier && log.topics[0] === expectedTopic) {
                const parsedLog = over18Verifier.interface.parseLog(log);
                aliceRequestId = parsedLog.args.requestId;
                break;
            }
        }

        if (!aliceRequestId) {
            throw new Error("Manual parsing FAILED to find the VerificationRequested event for Alice.");
        }
        console.log(`✅ Alice verification request ID: ${aliceRequestId}`);

        // --- Request verification for Bob ---
        console.log("\n📨 Requesting verification for Bob...");
        const bobRequestTx = await over18Verifier.connect(company).requestVerification(
            bob.address,
            { value: verificationFee }
        );
        const bobReceipt = await Utils.waitForTransaction(bobRequestTx, "Bob verification request");

        if (bobReceipt.status === 0) {
            throw new Error("Bob's verification request transaction FAILED and was reverted.");
        }

        // --- Manual Event Parsing for Bob ---
        console.log("✅ Transaction succeeded. Manually parsing event from raw logs...");
        let bobRequestId;
        for (const log of bobReceipt.logs) {
            if (log.address === deployments.over18Verifier && log.topics[0] === expectedTopic) {
                const parsedLog = over18Verifier.interface.parseLog(log);
                bobRequestId = parsedLog.args.requestId;
                break;
            }
        }

        if (!bobRequestId) {
            throw new Error("Manual parsing FAILED to find the VerificationRequested event for Bob.");
        }
        console.log(`✅ Bob verification request ID: ${bobRequestId}`);

        // --- Save request IDs ---
        const requestData = {
            alice: { requestId: aliceRequestId.toString(), requester: company.address, user: alice.address },
            bob: { requestId: bobRequestId.toString(), requester: company.address, user: bob.address }
        };
        fs.writeFileSync(path.join(__dirname, '../requestData.json'), JSON.stringify(requestData, null, 2));
        console.log("\n📄 Request data saved to requestData.json");

        // --- Show pending requests for users ---
        console.log("\n📋 Checking pending requests...");
        const alicePending = await over18Verifier.getPendingRequests(alice.address);
        console.log(`Alice has ${alicePending.length} pending request(s): ${alicePending.join(', ')}`);
        const bobPending = await over18Verifier.getPendingRequests(bob.address);
        console.log(`Bob has ${bobPending.length} pending request(s): ${bobPending.join(', ')}`);

        console.log("\n🎉 Verification requests sent successfully!");

    } catch (error) {
        console.error("❌ Error requesting verifications:", error);
        process.exit(1);
    }
}

if (require.main === module) {
    requestVerifications().catch(console.error);
}

module.exports = { requestVerifications };