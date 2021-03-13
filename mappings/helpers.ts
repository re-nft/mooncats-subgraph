import { Address, Bytes } from "@graphprotocol/graph-ts";
import { Cat, MoonRescuer } from "../generated/schema";

// todo: base64 image in here as well ?
export const fetchCat = (id: Bytes): Cat => {
  let cat = Cat.load(id.toHexString());
  if (cat === null) {
    cat = new Cat(id.toHexString());
    cat.inMyWallet = false;
    cat.save();
  }
  return <Cat>cat;
};

export const fetchMoonRescuer = (address: Address): MoonRescuer => {
  let moonRescuer = MoonRescuer.load(address.toHexString());
  if (moonRescuer === null) {
    moonRescuer = new MoonRescuer(address.toHexString());
    moonRescuer.cats = new Array<string>();
    moonRescuer.save();
  }
  return <MoonRescuer>moonRescuer;
};
