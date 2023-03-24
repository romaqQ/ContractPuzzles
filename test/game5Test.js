const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();

    return { game };
  }
  it('should be a winner', async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);

    // good luck
    // convert the hexademical string to a number
    // 16 is the base of the number system
    const threshold = parseInt('0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf', 16);
    // create random wallet with ethers
    let wallet = ethers.Wallet.createRandom();
    let i = 0;
    while (true) {
      // get the address of the wallet
      const address = await wallet.getAddress();
      // convert the address to a number
      const addressAsNumber = parseInt(address, 16);
      // check if the address is less than the threshold
      if (addressAsNumber < threshold) {
        // if it is, break out of the loop
        break;
      }
      // if it is not, create a new wallet
      wallet = ethers.Wallet.createRandom();
      i++;
      console.log(`Tried ${i} times - addressAsNumber: ${addressAsNumber} - threshold: ${threshold}`);
    }
    // get the address of the wallet
    wallet = wallet.connect(ethers.provider);
    const signer = ethers.provider.getSigner(0);
    // send 1 ether to the wallet
    await signer.sendTransaction({ to: wallet.address, value: ethers.utils.parseEther('1') });


    await game.connect(wallet).win();

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
