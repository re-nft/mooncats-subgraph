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
  GenesisCatsAdded,
} from "../generated/MoonCatRescue/MoonCatRescue";
import {
  fetchCat,
  fetchMoonRescuer,
  createAdoptionOffered,
  createAdoptionRequested,
  fetchAdoptionOffer,
  fetchAdoptionRequest,
  // fetchGenesisCats
} from "./helpers";

let wrapperContract = "0x7c40c393dc0f283f318791d746d894ddd3693572";

export function handleCatAdopted(event: CatAdopted): void {
  let params = event.params;
  let catId = params.catId;
  let cat = fetchCat(catId);
  let from = fetchMoonRescuer(params.from);
  let to = fetchMoonRescuer(params.to);
  cat.owner = params.to.toHexString();
  cat.inWallet = true;
  to.save();
  cat.save();
  from.save();
}

export function handleCatRescued(event: CatRescued): void {
  let params = event.params;
  let catId = params.catId;
  let cat = fetchCat(catId);
  let to = fetchMoonRescuer(params.to);
  cat.owner = params.to.toHexString();
  cat.inWallet = false;
  to.save();
  cat.save();
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
  if (params.toAddress.toHexString() == wrapperContract) {
    cat.wasWrapped = true;
  }
  adoptionOffer.save();
  cat.save();
}

export function handleAdoptionOfferCancelled(
  event: AdoptionOfferCancelled
): void {
  let params = event.params;
  let catId = params.catId;
  let cat = fetchCat(catId);
  let adoptionOffer = fetchAdoptionOffer(cat.id);
  adoptionOffer = null;
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
  let adoptionRequest = fetchAdoptionRequest(cat.id);
  adoptionRequest = null;
  cat.adoptionRequested = null;
  cat.save();
}

export function handleGenesisCatsAdded(event: GenesisCatsAdded): void {
  let params = event.params;
  let catIds = params.catIds;
  catIds.forEach((catId) => {
    let cat = fetchCat(catId);
    cat.isGenesis = true;
    cat.save();
  });
}
