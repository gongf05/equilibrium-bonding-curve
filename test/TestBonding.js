const BondingCurve = artifacts.require("BondingCurve.sol");
const Token = artifacts.require("Token.sol");

const utils = require('./Utils');


contract('BondingCurve', function(accounts) {


  it("Verifies that the bounding curve works", async () => {
    let bonding = await BondingCurve.deployed();
    let token = await Token.deployed();

    // owner accounts[0] send tokens to other users for purchase
    const bal = await token.balanceOf.call(accounts[0])
    console.log(`owner has balance := ${bal.valueOf()} now`)
    await token.transfer(accounts[1], 2000, { from: accounts[0] })
    const bal1 = await token.balanceOf.call(accounts[1])
    console.log(`user 1 has balance := ${bal1.valueOf()} now`)
    await token.transfer(accounts[2], 2000, { from: accounts[0] })
    const bal2 = await token.balanceOf.call(accounts[2])
    console.log(`user 2 has balance := ${bal2.valueOf()} now`)
    await token.transfer(accounts[3], 2000, { from: accounts[0] })
    const bal3 = await token.balanceOf.call(accounts[3])
    console.log(`user 3 has balance := ${bal3.valueOf()} now`)

    console.log(`-------------------------`)
    // first user buy 50 bonded tokens
    let price = await bonding.queryNextPrice({ from: accounts[1] })
    console.log(`user 1 get next purchase price := ${price.valueOf()} now`)
    // first approve bonding contract to withdraw money
    await token.approve(bonding.address, 2000, { from: accounts[1] })
    // buy 50 bonded tokens
    await bonding.buyTokens(50, 2, { from: accounts[1] })
    console.log(`user 1 bought 50 bonded tokens with price =  ${price.valueOf()} and target price = 2`)
    // current balance
    let ntoken = await bonding.getTokenBalance({ from: accounts[1] })
    console.log(`user 1 has token balance = ${ntoken.valueOf()}`)

    console.log(`-------------------------`)

    let supply = await bonding.getTokenSupply({ from: accounts[2] })
    console.log(`user 2 want to buy, current supply := ${supply.valueOf()} now`)

    // second user buy 50 bonded tokens
    price = await bonding.queryNextPrice({ from: accounts[2] })
    console.log(`user 2 get next purchase price := ${price.valueOf()} now`)
    // second approve bonding contract to withdraw money
    await token.approve(bonding.address, 2000, { from: accounts[2] })
    // buy 50 bonded tokens
    await bonding.buyTokens(50, 3, { from: accounts[2] })
    console.log(`user 2 bought 50 bonded tokens with price =  ${price.valueOf()} and target price = 3`)
    // current balance
    ntoken = await bonding.getTokenBalance({ from: accounts[2] })
    console.log(`user 2 has boneded token balance = ${ntoken.valueOf()}`)

    console.log(`-------------------------`)

    supply = await bonding.getTokenSupply({ from: accounts[3] })
    console.log(`user 3 want to buy, current supply := ${supply.valueOf()} now`)


    // third user to buy from the second user
    price = await bonding.queryNextPrice({ from: accounts[3] })
    console.log(`user 3 get next purchase price := ${price.valueOf()} now`)
    // second approve bonding contract to withdraw money
    await token.approve(bonding.address, 2000, { from: accounts[3] })
    // buy 50 bonded tokens
    await bonding.buyTokens(50, 5, { from: accounts[3] })
    console.log(`user 3 bought 50 bonded tokens with price =  ${price.valueOf()} and target price = 5`)
    // current balance
    ntoken = await bonding.getTokenBalance({ from: accounts[3] })
    console.log(`user 3 has bonded token balance = ${ntoken.valueOf()}`)

    ntoken = await bonding.getTokenBalance({ from: accounts[2] })
    console.log(`user 2 has bonded token balance = ${ntoken.valueOf()}`)

    console.log(`-------------------------`)

    let bb = await token.balanceOf.call(bonding.address)
    console.log(`BondingCurve contract has reserved token balance := ${bb.valueOf()} now`)


    bb = await token.balanceOf.call(accounts[2])
    console.log(`user 2 has reserved token balance := ${bb.valueOf()} now`)

    bb = await token.balanceOf.call(accounts[3])
    console.log(`user 3 has reserved token balance := ${bb.valueOf()} now`)

    console.log(`-------------------------`)
    console.log(`user 3 decides to liquidate his 50 bonded tokens`)
    // user 3 sell his bonded tokens
    await bonding.sellTokens(50, { from: accounts[3] })
    bb = await token.balanceOf.call(bonding.address)
    console.log(`BondingCurve contract has reserved token balance := ${bb.valueOf()} now`)

    bb = await token.balanceOf.call(accounts[3])
    console.log(`user 3 has reserved token balance := ${bb.valueOf()} now`)


  });

});
