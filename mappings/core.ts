import { store } from "@graphprotocol/graph-ts";

import {
  CatAdopted,
  CatRescued,
  CatNamed,
  AdoptionOffered,
  AdoptionOfferCancelled,
  AdoptionRequested,
  AdoptionRequestCancelled,
} from "../generated/MoonCatRescue/MoonCatRescue";
import {
  createCat,
  getCat,
  createOwner,
  getOwner,
  fetchOwner,
  createRequestPrice,
  getRequestPrice,
  createOfferPrice,
  getOfferPrice,
  createProvenance,
  getProvenance,
  fetchProvenance
} from "./helpers";

let wrapperContract = "0x7c40c393dc0f283f318791d746d894ddd3693572";

// catNamed only once
// catRescued once - creation time

// adoptionRequests and adoptionOffers are created and cancelled
// catAdopted with a matching request/offer means filled request/order

// catAdopted - every time that transferCat is called. owner changes here to to

// this is the only place where the cat is created
export function handleCatRescued(event: CatRescued): void {
  let cat = createCat(event.params.catId.toHex(), event.params.to.toHex(), event.block.timestamp);
  cat.save();
}

// called on every transferCat call
// 1. acceptAdoptionOffer   - someone sold their cat on their  terms
// 2. acceptAdoptionRequest - someone sold their cat on else's terms
// 3. giveCat - feeling generous
export function handleCatAdopted(event: CatAdopted): void {

}

// * I have a cat, you [0x123..333] (or any1 [0x0]) can buy it from me for X wei
// * push to the list of offer prices, set active = true
export function handleAdoptionOffered(event: AdoptionOffered): void {
  let offerPriceId = getOfferPriceId(event);
  let provenanceId = event.params.catId.toHex();
  let offerPrice = createOfferPrice(offerPriceId, provenanceId, event);
  offerPrice.save();
}

// * Do not remove the OfferPrice, but set the active field to false
export function handleAdoptionOfferCancelled(
  event: AdoptionOfferCancelled
): void {
  // let offerPriceId = getOfferPriceId()
}

// * I like a cat, and I am offering a cat owner, to buy it from (me) for price
export function handleAdoptionRequested(event: AdoptionRequested): void {
}

export function handleAdoptionRequestCancelled(
  event: AdoptionRequestCancelled
): void {
}





export function handleCatNamed(event: CatNamed): void {
  let catId = event.params.catId;
  let cat = fetchCat(catId);
  cat.name = event.params.catName.toString();
  cat.save();
}

export function getOfferPriceId(event: AdoptionOffered): string {
  return event.params.catId.toHex() + "::" + event.transactionLogIndex.toHex();
}

export function getRequestPriceId(event: AdoptionRequested): string {
  return event.params.catId.toHex() + "::" + event.transactionLogIndex.toHex();
}