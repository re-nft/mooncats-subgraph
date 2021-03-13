import { Address } from "@graphprotocol/graph-ts";
import { Cat, MoonRescuer } from "../generated/schema";

export const fetchCat = (id: string): Cat => {
  let cat = Cat.load(id);
  if (cat === null) {
    cat = new Cat(id);
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
