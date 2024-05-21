const convertBigIntToString = (pets) => {
  return pets.map((pet) => {
    const petCopy = { ...pet };
    for (let key in petCopy) {
      if (typeof petCopy[key] === "bigint") {
        petCopy[key] = petCopy[key].toString();
      }
    }
    return petCopy;
  });
};

module.exports = { convertBigIntToString };
