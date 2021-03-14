import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  Cat,
  MoonRescuer,
  AdoptionRequested,
  AdoptionOffered,
  RequestPrice,
  OfferPrice
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
    cat.activeAdoptionRequest = null;
    cat.activeAdoptionOffer = null;
    cat.wasWrapped = false;
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
  from: Address,
  timestamp: BigInt
): AdoptionRequested => {
  let adoptionRequest = new AdoptionRequested(id);
  adoptionRequest.price = price;
  adoptionRequest.from = from;
  adoptionRequest.timestamp = timestamp;
  return <AdoptionRequested>adoptionRequest;
};

export const fetchAdoptionRequest = (id: string): AdoptionRequested => {
  let adoptionRequested = AdoptionRequested.load(id);
  return <AdoptionRequested>adoptionRequested;
};

export const createAdoptionOffered = (
  id: string,
  price: BigInt,
  toAddress: Address,
  timestamp: BigInt
): AdoptionOffered => {
  let adoptionOffer = new AdoptionOffered(id);
  adoptionOffer.price = price;
  adoptionOffer.toAddress = toAddress;
  adoptionOffer.timestamp = timestamp;
  return <AdoptionOffered>adoptionOffer;
};

export const fetchAdoptionOffer = (id: string): AdoptionOffered => {
  let adoptionOffered = AdoptionOffered.load(id);
  return <AdoptionOffered>adoptionOffered;
};

export const createRequestPrice = (id: string, price: BigInt, timestamp: BigInt, cat: string): RequestPrice => {
  let requestPrice = new RequestPrice(id);
  requestPrice.price = price;
  requestPrice.timestamp = timestamp;
  requestPrice.cat = cat;
  return <RequestPrice>requestPrice;
}

export const createOfferPrice = (id: string, price: BigInt, timestamp: BigInt, cat: string): RequestPrice => {
  let offerPrice = new OfferPrice(id);
  offerPrice.price = price;
  offerPrice.timestamp = timestamp;
  offerPrice.cat = cat;
  return <RequestPrice>offerPrice;
}
