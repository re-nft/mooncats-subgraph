import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  Cat,
  MoonRescuer,
  AdoptionRequested,
  AdoptionOffered,
} from "../generated/schema";

let ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const fetchCat = (id: Bytes): Cat => {
  let _id = id.toHexString();
  let cat = Cat.load(_id);
  if (cat === null) {
    cat = new Cat(_id);
    cat.name = null;
    cat.owner = ZERO_ADDRESS;
    cat.inWallet = false;
    cat.adoptionRequested = null;
    cat.adoptionOffered = null;
    cat.wasWrapped = false;
    cat.isGenesis = false;
  }
  return <Cat>cat;
};

export const fetchMoonRescuer = (address: Bytes): MoonRescuer => {
  let _address = address.toHexString();
  let moonRescuer = MoonRescuer.load(_address);
  if (moonRescuer === null) {
    moonRescuer = new MoonRescuer(_address);
  }
  return <MoonRescuer>moonRescuer;
};

export const createAdoptionRequested = (
  id: string,
  price: BigInt,
  from: Address
): AdoptionRequested => {
  let adoptionRequest = new AdoptionRequested(id);
  adoptionRequest.price = price;
  adoptionRequest.from = from;
  return <AdoptionRequested>adoptionRequest;
};

export const fetchAdoptionRequest = (id: string): AdoptionRequested => {
  let adoptionRequested = AdoptionRequested.load(id);
  return <AdoptionRequested>adoptionRequested;
};

export const createAdoptionOffered = (
  id: string,
  price: BigInt,
  toAddress: Address
): AdoptionOffered => {
  let adoptionOffer = new AdoptionOffered(id);
  adoptionOffer.price = price;
  adoptionOffer.toAddress = toAddress;
  return <AdoptionOffered>adoptionOffer;
};

export const fetchAdoptionOffer = (id: string): AdoptionOffered => {
  let adoptionOffered = AdoptionOffered.load(id);
  return <AdoptionOffered>adoptionOffered;
};
