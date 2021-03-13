import { log } from "@graphprotocol/graph-ts";

import {
  CatAdopted,
  CatRescued,
} from "../generated/MoonCatRescue/MoonCatRescue";
import { fetchCat, fetchMoonRescuer } from "./helpers";

export function handleCatAdopted(event: CatAdopted): void {
  let catAdoptedParams = event.params;

  let catId = <string>catAdoptedParams.catId.toHexString();

  let cat = fetchCat(catId);
  let to = fetchMoonRescuer(catAdoptedParams.to);
  let from = fetchMoonRescuer(catAdoptedParams.from);

  log.debug("\n[START - handleCatAdopted]\nto{}\nfrom{}\ncat{}\n", [
    to.cats.join(","),
    from.cats.join(", cat id:"),
    cat.id.concat(" - in wallet: ").concat(cat.inMyWallet ? "true" : "false"),
  ]);

  let toCatsCopy = to.cats;
  let fromCatsCopy = from.cats;

  let fromCatsIx = fromCatsCopy.indexOf(catId);
  fromCatsCopy.splice(fromCatsIx, 1);
  from.cats = fromCatsCopy;

  toCatsCopy.push(catId);
  to.cats = toCatsCopy;

  cat.inMyWallet = true;

  log.debug("\n[END - handleCatAdopted]\nto{}\nfrom{}\ncat{}\n", [
    to.cats.join(","),
    from.cats.join(","),
    cat.id.concat(" - in wallet: ").concat(cat.inMyWallet ? "true" : "false"),
  ]);

  cat.save();
  to.save();
  from.save();
}

export function handleCatRescued(event: CatRescued): void {
  let catRescuedParams = event.params;

  let catId = <string>catRescuedParams.catId.toHexString();
  let cat = fetchCat(catId);
  let to = fetchMoonRescuer(catRescuedParams.to);

  log.debug("\n[START - handleCatRescued]\nto{}\ncat{}\n", [
    to.cats.join(","),
    cat.id.concat(" - in wallet: ").concat(cat.inMyWallet ? "true" : "false"),
  ]);

  let winnerCats = to.cats;
  winnerCats.push(catId);
  to.cats = winnerCats;

  cat.inMyWallet = false;

  log.debug("\n[END - handleCatRescued]\nto{}\ncat{}\n", [
    to.cats.join(","),
    cat.id.concat(" - in wallet: ").concat(cat.inMyWallet ? "true" : "false"),
  ]);

  cat.save();
  to.save();
}
