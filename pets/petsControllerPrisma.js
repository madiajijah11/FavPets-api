const { PrismaClient } = require("@prisma/client");
const { convertBigIntToString } = require("../utils/convertBigIntToString");

const prisma = new PrismaClient();

const newPet = async (req, res) => {
  const { src, name, age, type, breed, description, owner } = req.body;

  const height = Math.floor(Math.random() * 2) + 1;
  const width = height === 1 ? 3 : 4;

  const validImageExtensions = [".jpg", ".png", ".jpeg", ".gif", ".svg"];
  const srcExtension = src.split(".").pop();

  if (!src || !validImageExtensions.includes(`.${srcExtension}`)) {
    return res.status(400).json({
      message: "Image must be a valid image",
    });
  }

  if (
    !src ||
    !height ||
    !width ||
    !name ||
    !age ||
    !type ||
    !breed ||
    !description
  ) {
    return res.status(400).json({
      message: "Please fill all fields",
    });
  }

  try {
    const newPet = await prisma.pet.create({
      data: {
        src,
        height,
        width,
        name,
        age: BigInt(age),
        type,
        breed,
        description,
        ownerId: owner,
      },
    });
    res.status(200).json(newPet);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const getPets = async (_req, res) => {
  try {
    const pets = await prisma.pet.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const petsWithNoBigInt = convertBigIntToString(pets);

    res.status(200).json(petsWithNoBigInt);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const getPetByUserId = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "User not found",
    });
  }

  try {
    const pets = await prisma.pet.findMany({
      where: {
        ownerId: id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const petsWithNoBigInt = convertBigIntToString(pets);

    res.status(200).json(petsWithNoBigInt);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const deletePetById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "Pet not found",
    });
  }

  try {
    const pet = await prisma.pet.delete({
      where: {
        id,
      },
    });
    res.status(200).json(pet);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const getPetById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "Pet not found",
    });
  }

  try {
    const pet = await prisma.pet.findUnique({
      where: {
        id,
      },
    });
    res.status(200).json(pet);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const updatePetById = async (req, res) => {
  const { id } = req.params;
  const { src, name, age, type, breed, description } = req.body;

  if (!id) {
    return res.status(400).json({
      message: "Pet not found",
    });
  }

  try {
    const pet = await prisma.pet.update({
      where: {
        id,
      },
      data: {
        src,
        name,
        age: BigInt(age),
        type,
        breed,
        description,
      },
    });
    res.status(200).json(pet);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

module.exports = {
  newPet,
  getPets,
  deletePetById,
  getPetById,
  updatePetById,
  getPetByUserId,
};
