const BondingCurve = artifacts.require("BondingCurve.sol");
const Token = artifacts.require("Token.sol");
const PQ = artifacts.require("PriorityQueue.sol");

const utils = require('./Utils');


contract('BondingCurve', function(accounts) {


  it("Verifies that the bounding curve works", async () => {
    let bonding = await BondingCurve.deployed();
    let token = await Token.deployed();
    let priority_queue = await PQ.deployed();

    // uint256 _price, uint256 _orderId, uint256 _amount
    let tx
    tx = await priority_queue.insertOrder(10, 10, { from: accounts[0] })
    tx = await priority_queue.insertOrder(11, 5, { from: accounts[2] })
    tx = await priority_queue.insertOrder(8, 5, { from: accounts[2] })
    tx = await priority_queue.insertOrder(23, 5, { from: accounts[2] })
    tx = await priority_queue.insertOrder(113, 5, { from: accounts[2] })
    console.log('first tx use gas = ', tx.receipt.gasUsed)
    tx = await priority_queue.insertOrder(6, 15, { from: accounts[1] })
    console.log('second tx use gas = ', tx.receipt.gasUsed)
    tx = await priority_queue.insertOrder(13, 5, { from: accounts[2] })
    console.log('third tx use gas = ', tx.receipt.gasUsed)
    tx = await priority_queue.insertOrder(10, 10, { from: accounts[2] })
    console.log('fourth tx use gas = ', tx.receipt.gasUsed)
    let info = await priority_queue.getMinOrder()
    console.log(`current min order: Id = ${info[0].valueOf()}, price = ${info[1].valueOf()}, amount = ${info[2].valueOf()}, seller = ${info[3]}`)

    tx = await priority_queue.delMin()
    console.log('delete tx use gas = ', tx.receipt.gasUsed)
    info = await priority_queue.getMinOrder()
    console.log(`current min order: Id = ${info[0].valueOf()}, price = ${info[1].valueOf()}, amount = ${info[2].valueOf()}, seller = ${info[3]}`)




  });
});
