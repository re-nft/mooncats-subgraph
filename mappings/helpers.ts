import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  Cat,
  MoonRescuer,
  AdoptionRequested,
  AdoptionOffered,
} from "../generated/schema";

export const fetchCat = (id: string): Cat => {
  let cat = Cat.load(id);
  if (cat === null) {
    cat = new Cat(id);
    cat.inWallet = false;
    cat.save();
  }
  return <Cat>cat;
};

export const fetchMoonRescuer = (address: Address): MoonRescuer => {
  let _address = address.toHexString();
  let moonRescuer = MoonRescuer.load(_address);
  if (moonRescuer === null) {
    moonRescuer = new MoonRescuer(_address);
    moonRescuer.cats = new Array<string>();
    moonRescuer.save();
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
  }
  adoptionRequest.price = price;
  adoptionRequest.from = from;
  adoptionRequest.save();
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
  }
  adoptionOffer.price = price;
  adoptionOffer.toAddress = toAddress;
  adoptionOffer.save();
  return <AdoptionOffered>adoptionOffer;
};
