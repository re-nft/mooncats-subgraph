// import { log, BigInt } from "@graphprotocol/graph-ts";
import { BigInt } from "@graphprotocol/graph-ts";

import {
  CatAdopted,
  CatRescued,
  CatNamed,
  AdoptionOffered,
  AdoptionOfferCancelled,
  AdoptionRequested,
  AdoptionRequestCancelled,
  // GenesisCatsAdded,
} from "../generated/MoonCatRescue/MoonCatRescue";
import {
  fetchCat,
  fetchMoonRescuer,
  createAdoptionOffered,
  createAdoptionRequested,
  // fetchGenesisCats
} from "./helpers";

export function handleCatAdopted(event: CatAdopted): void {
  let catAdoptedParams = event.params;
  let catId = catAdoptedParams.catId;

  let cat = fetchCat(catId);
  let from = fetchMoonRescuer(catAdoptedParams.from);
  let to = fetchMoonRescuer(catAdoptedParams.to);

  let toCatsCopy = to.cats;
  let fromCatsCopy = from.cats;

  if (from.id !== to.id) {
    let fromCatsIx = fromCatsCopy.indexOf(cat.id);
    fromCatsCopy.splice(fromCatsIx, 1);
    from.cats = fromCatsCopy;
    from.save();
    toCatsCopy.push(cat.id);
    to.cats = toCatsCopy;
    to.save();
  } else {
    let ix = toCatsCopy.indexOf(cat.id);
    if (ix === -1) {
      toCatsCopy.push(cat.id);
      to.cats = toCatsCopy;
      to.save();
    }
  }
  cat.inWallet = true;
  cat.save();
}

export function handleCatRescued(event: CatRescued): void {
  let catRescuedParams = event.params;
  let catId = catRescuedParams.catId;

  let cat = fetchCat(catId);
  let to = fetchMoonRescuer(catRescuedParams.to);

  let toCatsCopy = to.cats;
  toCatsCopy.push(cat.id);
  to.cats = toCatsCopy;

  cat.inWallet = false;

  cat.save();
  to.save();
}

export function handleCatNamed(event: CatNamed): void {
  let catNamedParams = event.params;
  let catId = catNamedParams.catId;
  let cat = fetchCat(catId);
  cat.name = catNamedParams.catName.toHexString();
  cat.save();
}

// * I own a cat, and I am offering toAddress to buy it from me for price
// you as the owner, are offering someone, to buy the cat from you
export function handleAdoptionOffered(event: AdoptionOffered): void {
  let params = event.params;
  let catId = params.catId;
  let cat = fetchCat(catId);
  let adoptionOffer = createAdoptionOffered(
    cat.id,
    params.price,
    params.toAddress
  );
  cat.adoptionOffered = adoptionOffer.id;
  adoptionOffer.save();
  cat.save();
}

export function handleAdoptionOfferCancelled(
  event: AdoptionOfferCancelled
): void {
  let params = event.params;
  let catId = params.catId;
  let cat = fetchCat(catId);
  cat.adoptionOffered = null;
  cat.save();
}

// * I like a cat, and I am offering a cat owner, to buy it from (me) for price
export function handleAdoptionRequested(event: AdoptionRequested): void {
  let params = event.params;
  let catId = params.catId;
  let cat = fetchCat(catId);
  let adoptionRequest = createAdoptionRequested(
    cat.id,
    params.price,
    params.from
  );
  cat.adoptionRequested = adoptionRequest.id;
  adoptionRequest.save();
  cat.save();
}

export function handleAdoptionRequestCancelled(
  event: AdoptionRequestCancelled
): void {
  let params = event.params;
  let catId = params.catId;
  let cat = fetchCat(catId);
  cat.adoptionRequested = null;
  cat.save();
}
