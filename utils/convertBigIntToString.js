const convertBigIntToString = (pets) => {
  const convert = (pet) => {
    const petCopy = { ...pet };
    for (let key in petCopy) {
      if (typeof petCopy[key] === "bigint") {
        petCopy[key] = petCopy[key].toString();
      }
    }
    return petCopy;
  };

  if (Array.isArray(pets)) {
    return pets.map(convert);
  } else {
    return convert(pets);
  }
};

module.exports = { convertBigIntToString };
