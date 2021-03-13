import { log } from "@graphprotocol/graph-ts";

import {
  CatAdopted,
  CatRescued,
  CatNamed,
  AdoptionOffered,
  AdoptionOfferCancelled,
  AdoptionRequested,
} from "../generated/MoonCatRescue/MoonCatRescue";
import {
  fetchCat,
  fetchMoonRescuer,
  createAdoptionRequest,
  createAdoptionOffer,
} from "./helpers";

export function handleCatAdopted(event: CatAdopted): void {
  let catAdoptedParams = event.params;

  let catId = catAdoptedParams.catId.toHexString();

  let cat = fetchCat(catId);
  let to = fetchMoonRescuer(catAdoptedParams.to);
  let from = fetchMoonRescuer(catAdoptedParams.from);

  // log.debug("\n[START - handleCatAdopted]\nto{}\nfrom{}\ncat{}\n", [
  //   to.cats.join(","),
  //   from.cats.join(", cat id:"),
  //   cat.id.concat(" - in wallet: ").concat(cat.inMyWallet ? "true" : "false"),
  // ]);

  let toCatsCopy = to.cats.slice(0);
  let fromCatsCopy = from.cats.slice(0);

  log.info("[handleCatAdopted] looking for {}", [cat.id]);

  let fromCatsIx = fromCatsCopy.indexOf(cat.id);
  fromCatsCopy.splice(fromCatsIx, 1);
  from.cats = fromCatsCopy;

  toCatsCopy.push(catId);
  to.cats = toCatsCopy;

  cat.inWallet = true;

  // log.debug("\n[END - handleCatAdopted]\nto{}\nfrom{}\ncat{}\n", [
  //   to.cats.join(","),
  //   from.cats.join(","),
  //   cat.id.concat(" - in wallet: ").concat(cat.inMyWallet ? "true" : "false"),
  // ]);

  cat.save();
  to.save();
  from.save();
}

export function handleCatRescued(event: CatRescued): void {
  let catRescuedParams = event.params;

  let catId = catRescuedParams.catId.toHexString();
  let cat = fetchCat(catId);
  let to = fetchMoonRescuer(catRescuedParams.to);

  // log.debug("\n[START - handleCatRescued]\nto{}\ncat{}\n", [
  //   to.cats.join(","),
  //   cat.id.concat(" - in wallet: ").concat(cat.inMyWallet ? "true" : "false"),
  // ]);

  let winnerCats = to.cats.slice(0);
  winnerCats.push(cat.id);
  to.cats = winnerCats;

  cat.inWallet = false;

  // log.debug("\n[END - handleCatRescued]\nto{}\ncat{}\n", [
  //   to.cats.join(","),
  //   cat.id.concat(" - in wallet: ").concat(cat.inMyWallet ? "true" : "false"),
  // ]);

  cat.save();
  to.save();
}

export function handleCatNamed(event: CatNamed): void {
  let catNamedParams = event.params;
  let catId = catNamedParams.catId.toHexString();
  let cat = fetchCat(catId);
  cat.name = catNamedParams.catName.toHexString();
  cat.save();
}

// you as the owner, are offering someone, to buy the cat from you
export function handleAdoptionOffered(event: AdoptionOffered): void {
  let params = event.params;
  let catId = params.catId.toHexString();
  let cat = fetchCat(catId);

  // since adoption offers are overwritten, there is no danger in using this id
  let adoptionOfferId = event.transaction.hash
    .toHexString()
    .concat("::")
    .concat(cat.id);

  createAdoptionOffer(adoptionOfferId, params.price, params.toAddress);
  cat.adoptionOffer = adoptionOfferId;
  cat.save();
}

export function handleAdoptionOfferCanceleld(
  event: AdoptionOfferCancelled
): void {
  let params = event.params;
  let catId = params.catId.toHexString();
  let cat = fetchCat(catId);
  cat.adoptionOffer = null;
  cat.save();
}

export function handleAdoptionRequested(event: AdoptionRequested): void {
  let params = event.params;
  let catId = params.catId.toHexString();
  let cat = fetchCat(catId);

  let adoptionRequestId = event.transaction.hash
    .toHexString()
    .concat("::")
    .concat(cat.id);

  createAdoptionRequest(adoptionRequestId, params.from, params.price);

  cat.adoptionRequest = adoptionRequestId;
  cat.save();
}
