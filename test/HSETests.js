const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Test HSE Token", () => {
    beforeEach(async function () {
        this.HSETokenFactory = await ethers.getContractFactory('HSEToken');
        this.HSEToken = await this.HSETokenFactory.deploy();
        await this.HSEToken.deployed();
        this.decimals = await this.HSEToken.decimals();
        [this.owner, this.recipient, this.user] = await ethers.getSigners();
    });
    
    it('Check token name', async function () {
        expect(await this.HSEToken.name()).to.equal('HSE Token');
    });
    
    it('Check token symbol', async function () {
        expect(await this.HSEToken.symbol()).to.equal('HSE');
    });
    
    it('Check correct initial supply', async function () {
        const expectedSupply = ethers.utils.parseUnits('100000', this.decimals);
        expect((await this.HSEToken.totalSupply()).toString()).to.equal(expectedSupply);
    });
    
    it('"Verifies functionality of method for querying account balances"', async function () {
        const ownerAddress = this.owner.address;
        const ownerBalance = ethers.utils.parseUnits('100000', this.decimals);
        const realOwnerBalance = await this.HSEToken.balanceOf(ownerAddress);
        expect(realOwnerBalance).to.equal(ownerBalance);
        
        const recipientAddress = this.recipient.address;
        const recipientBalance = await this.HSEToken.balanceOf(recipientAddress);
        expect(recipientBalance).to.equal(0);
    });
      
    it("Validates the ability of owner to transfer tokens to other accounts", async function () {
        const amount = ethers.utils.parseUnits('100000', this.decimals);
        const ownerAddress = this.owner.address;
        const recipientAddress = this.recipient.address;

        await this.HSEToken.connect(this.owner).transfer(recipientAddress, amount);

        const recipientBalance = await this.HSEToken.balanceOf(recipientAddress);
        expect(recipientBalance).to.equal(amount);

        const ownerBalance = await this.HSEToken.balanceOf(ownerAddress);
        expect(ownerBalance).to.equal(0);
    });
  
    it("Validates the ability of owner to mint tokens", async function () {
        const ownerAddress = this.owner.address;

        const balance = await this.HSEToken.balanceOf(ownerAddress);
        await this.HSEToken.connect(this.owner).mint(ownerAddress, 10000);
        expect(await this.HSEToken.balanceOf(ownerAddress)).to.equal(balance.add(10000));
    });

    it("Validates the unability of simple users to mint tokens", async function () {
        const recipientAddress = this.recipient.address;

        await expect(this.HSEToken.connect(this.recipient).mint(recipientAddress, 10000)).to.be.revertedWith("Ownable: caller is not the owner");;
    });
      
    it("Validates the ability of simple users to transfer tokens", async function () {
        const amount = ethers.utils.parseUnits('100000', this.decimals);
        const ownerAddress = this.owner.address;
        const recipientAddress = this.recipient.address;

        await this.HSEToken.connect(this.owner).mint(recipientAddress, amount);
        await this.HSEToken.connect(this.recipient).transfer(ownerAddress, amount);

        const recipientBalance = await this.HSEToken.balanceOf(recipientAddress);
        expect(recipientBalance).to.equal(0);

        const ownerBalance = await this.HSEToken.balanceOf(ownerAddress);
        expect(ownerBalance).to.equal(amount.add(amount));
    });

    it('Verifies the functionality of the approve method', async function () {
        const recipient = this.recipient.address;
        const sender = this.owner.address;
    
        const initialAllowance = await this.HSEToken.allowance(sender, recipient);
        expect(initialAllowance).to.equals(0);
    
        const amountToApprove = 100;
        await this.HSEToken.approve(recipient, amountToApprove, { from: sender });
        const updatedAllowance = await this.HSEToken.allowance(sender, recipient);
        expect(updatedAllowance).to.equals(amountToApprove);
    });
    
    it('user can approve and transfer tokens from another account', async function () {
        const ownerAddress = this.owner.address;
        const recipientAddress = this.recipient.address;
        const userAddress = this.user.address;
        const ownerBalanceBefore = await this.HSEToken.balanceOf(this.owner.address);
        const recipientBalanceBefore = await this.HSEToken.balanceOf(this.recipient.address);
        const userBalanceBefore = await this.HSEToken.balanceOf(this.user.address);
    
        await this.HSEToken.connect(this.owner).approve(recipientAddress, 100);
    
        await this.HSEToken.connect(this.recipient).transferFrom(ownerAddress, userAddress, 100);
    
        const ownerBalanceAfter = await this.HSEToken.balanceOf(this.owner.address);
        const recipientBalanceAfter = await this.HSEToken.balanceOf(this.recipient.address);
        const userBalanceAfter = await this.HSEToken.balanceOf(this.user.address);
    
        expect(ownerBalanceAfter).to.equal(ownerBalanceBefore.sub(100));
        expect(userBalanceAfter).to.equal(userBalanceBefore.add(100));
    
        expect(recipientBalanceAfter).to.equal(recipientBalanceBefore);
    });
    
    it("Should fail when attempting to transfer more tokens than the current balance", async function () {
        const ownerAddress = this.owner.address;
        const recipientAddress = this.recipient.address;
        const realOwnerBalance = await this.HSEToken.balanceOf(ownerAddress);
        const bigBalance = realOwnerBalance.add(realOwnerBalance);
        
        await expect(this.HSEToken.connect(this.owner).transfer(recipientAddress, bigBalance)).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });
});