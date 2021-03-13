import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  Cat,
  MoonRescuer,
  AdoptionRequested,
  AdoptionOffered,
  GenesisCats,
} from "../generated/schema";

export const fetchCat = (id: Bytes): Cat => {
  let _id = id.toHexString();
  let cat = Cat.load(_id);
  if (cat === null) {
    cat = new Cat(_id);
    cat.inWallet = false;
  }
  return <Cat>cat;
};

export const fetchMoonRescuer = (address: Bytes): MoonRescuer => {
  let _address = address.toHexString();
  let moonRescuer = MoonRescuer.load(_address);
  if (moonRescuer === null) {
    moonRescuer = new MoonRescuer(_address);
    moonRescuer.cats = new Array<string>();
  }
  return <MoonRescuer>moonRescuer;
};

export const createAdoptionRequested = (
  id: string,
  price: BigInt,
  from: Address
): AdoptionRequested => {
  let adoptionRequest = AdoptionRequested.load(id);
  if (adoptionRequest == null) {
    adoptionRequest = new AdoptionRequested(id);
    adoptionRequest.price = price;
    adoptionRequest.from = from;
  } else {
    adoptionRequest.price = price;
    adoptionRequest.from = from;
  }
  return <AdoptionRequested>adoptionRequest;
};

export const createAdoptionOffered = (
  id: string,
  price: BigInt,
  toAddress: Address
): AdoptionOffered => {
  let adoptionOffer = AdoptionOffered.load(id);
  if (adoptionOffer == null) {
    adoptionOffer = new AdoptionOffered(id);
    adoptionOffer.price = price;
    adoptionOffer.toAddress = toAddress;
  } else {
    adoptionOffer.price = price;
    adoptionOffer.toAddress = toAddress;
  }
  return <AdoptionOffered>adoptionOffer;
};

export const fetchGenesisCats = (cats: Bytes[]): GenesisCats => {
  let genesisCats = GenesisCats.load("0");

  if (genesisCats == null) {
    genesisCats = new GenesisCats("0");
    // genesisCats.cats = cats;
    genesisCats.save();
  }

  let allGenesisCats = genesisCats.cats.slice(0);
  // allGenesisCats.push(cat.id);
  genesisCats.cats = allGenesisCats;
  return <GenesisCats>genesisCats;
};
