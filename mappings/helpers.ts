import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  Cat,
  MoonRescuer,
  AdoptionRequest,
  AdoptionOffer,
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

export const createAdoptionRequest = (
  id: string,
  from: Address,
  price: BigInt
): AdoptionRequest => {
  let adoptionRequest = new AdoptionRequest(id);
  adoptionRequest.from = from;
  adoptionRequest.price = price;
  adoptionRequest.save();
  return <AdoptionRequest>adoptionRequest;
};

export const createAdoptionOffer = (
  id: string,
  price: BigInt,
  toAddress: Address
): AdoptionOffer => {
  let adoptionOffer = new AdoptionOffer(id);
  adoptionOffer.price = price;
  adoptionOffer.toAddress = toAddress;
  return <AdoptionOffer>adoptionOffer;
};
