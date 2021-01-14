
const { Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const {
    buildCAClient,
    registerAndEnrollUser,
    enrollAdmin,
} = require("./CAUtil.js");

const { buildWallet } = require("./AppUtils.js");
const { getCCP } = require("./buildCCP");
const path=require('path');
const walletPath = path.join(__dirname, 'wallet');
exports.registerUser = async ({ OrgMSP, userId }) => {


    let org = OrgMSP.match(/\d/g).join("");
    org = Number(org)
    const ccp = getCCP(org);

    const caClient = buildCAClient(FabricCAServices, ccp, `ca.org${org}.example.com`);

    // setup the wallet to hold the credentials of the application user
    const wallet = await buildWallet(Wallets, walletPath);

    // in a real application this would be done on an administrative flow, and only once
    let admin = await enrollAdmin(caClient, wallet, OrgMSP);

    // in a real application this would be done only when a new user was required to be added
    // and would be part of an administrative flow
    let enroll = await registerAndEnrollUser(
        caClient,
        wallet,
        OrgMSP,
        userId,
        `org${org}.department1`
    );
    return { enroll, admin, wallet }
}