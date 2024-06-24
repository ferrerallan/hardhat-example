import {
    time,
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
  import { expect } from "chai";
  import hre from "hardhat";
  
  describe("BookDatabase", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployFixture() {
  
      // Contracts are deployed using the first signer/account by default
      const [owner, otherAccount] = await hre.ethers.getSigners();
  
      const BookDatabase = await hre.ethers.getContractFactory("BookDatabase");
      const bookDatabase = await BookDatabase.deploy();
  
      return { bookDatabase, owner, otherAccount };
    }
  
    it("Should count = 0", async function () {
      const { bookDatabase, owner, otherAccount } = await loadFixture(deployFixture);
  
      const count = await bookDatabase.count();

      expect(count).to.equal(0);

    });

    it("Should add book", async function () {
        const { bookDatabase, owner, otherAccount } = await loadFixture(deployFixture);
    
        const book = await bookDatabase.addBook({
            title: "Harry Potter",
            year: 2000,
        });

        const count = await bookDatabase.count();
  
        expect(count).to.equal(1);
  
      });

    it("Should edit book", async function () {
        const { bookDatabase, owner, otherAccount } = await loadFixture(deployFixture);

        // Get the initial book count
        const initialCount = await bookDatabase.count();

        // Add a book
        const book = await bookDatabase.addBook({
            title: "Harry Potter",
            year: 2000,
        });

        // Get the book ID
        const bookId = 1;

        // Edit the book
        await bookDatabase.editBook(bookId, {
            title: "Harry Potter and the Chamber of Secrets",
            year: 2002,
        });

        // Get the edited book
        const editedBook = await bookDatabase.books(bookId);

        // Check if the book was edited correctly
        expect(editedBook.title).to.equal("Harry Potter and the Chamber of Secrets");
        expect(editedBook.year).to.equal(2002);

    });

    it ("Should delete book", async function () {
        const { bookDatabase, owner, otherAccount } = await loadFixture(deployFixture);

        // Get the initial book count
        const initialCount = await bookDatabase.count();

        // Add a book
        const book = await bookDatabase.addBook({
            title: "Harry Potter",
            year: 2000,
        });

        // Get the book ID
        const bookId = 1;

        // Delete the book
        await bookDatabase.removeBook(bookId);

        // Get the final book count
        const finalCount = await bookDatabase.count();

        // Check if the book was deleted correctly
        expect(finalCount).to.equal(0);
    });

    it ("Should not delete book", async function () {
        const { bookDatabase, owner, otherAccount } = await loadFixture(deployFixture);

        const instance = bookDatabase.connect(otherAccount);

        await expect(instance.removeBook(1))
        .to.be.revertedWith("You don't have permission.");


    });
     
  
  
  });
  