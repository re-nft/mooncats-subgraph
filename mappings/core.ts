import { Bytes, BigInt, Address, store } from "@graphprotocol/graph-ts";

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
  fetchOwner,
  createRequestPrice,
  getRequestPrice,
  createOfferPrice,
  getOfferPrice,
  getProvenance,
} from "./helpers";

let ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
let WRAPPER_CONTRACT = "0x7c40c393dc0f283f318791d746d894ddd3693572";

// catNamed only once
// catRescued once - creation time

// adoptionRequests and adoptionOffers are created and cancelled
// catAdopted with a matching request/offer means filled request/order

// catAdopted - every time that transferCat is called. owner changes here to to

// this is the only place where the cat is created
export function handleCatRescued(event: CatRescued): void {
  let cat = createCat(getCatId(event.params.catId), getOwnerId(event.params.to), event);
  cat.save();
}

// called on every transferCat call
// 1. acceptAdoptionOffer   - someone sold their cat on their  terms
// 2. acceptAdoptionRequest - someone sold their cat on else's terms
// 3. giveCat               - feeling generous
export function handleCatAdopted(event: CatAdopted): void {
  // catId, price, from, to
  // filled       of either the offerPrice or requestPrice
  // active false of either the offerPrice or requestPrice
  // if to   is 0x7c40c393dc0f283f318791d746d894ddd3693572 - wrapped
  // if from is 0x7c40c393dc0f283f318791d746d894ddd3693572 - unwrapped
  // owner of cat changes
  let catId = getCatId(event.params.catId);
  let cat = getCat(catId);
  let provenanceId = getProvenanceId(event.params.catId);
  let provenance = getProvenance(provenanceId);

  let from = event.params.from;
  let to = event.params.to;

  if (getAddress(to) == ZERO_ADDRESS) {
    // bye bye kitty
    store.remove('Cat', catId);
    return;
  }

  // todo: this may not work as expected
  let lastOfferId = provenance.offerPrices[provenance.offerPrices.length - 1];
  let lastRequestId = provenance.requestPrices[provenance.requestPrices.length - 1];
  let lastOffer = getOfferPrice(lastOfferId);
  let lastRequest = getRequestPrice(lastRequestId);

  // offer was accepted if:
  // offer's to is 0x0, offer's from is CatAdopted's from, to is anything, price is offer's price
  // offer's to is not 0x0, offer's from is CatAdopted's from, to is offer's to, price is offer's price
  // cat was wrapped if:
  // offer's to is wrapper, offer's from is CatAdopted's from, 

  // wrapped
  if (getAddress(to) == WRAPPER_CONTRACT) {
    cat.isWrapped = true;
    // owner effectively changes to the wrapper contract
    // but only the original user can perform actions with the wrapped cat
    // for that reason, we do not change the owner here
    lastOffer.active = false;
    lastOffer.save();
    provenance.save();
    cat.save();
    return;
  }

  // unwrapped
  if (getAddress(from) == WRAPPER_CONTRACT) {
    // accepting offer does not cancel an active request
    cat.isWrapped = false;
    lastOffer.active = false;
    let newOwner = fetchOwner(getOwnerId(to));
    cat.owner = newOwner.id;
    lastOffer.save();
    provenance.save();
    newOwner.save();
    cat.save();
    return;
  }

  if (lastOffer.active) {
    if (getAddress(lastOffer.to) == getAddress(to) || getAddress(lastOffer.to) == ZERO_ADDRESS) {
      // successful offer accepted
      // cat changes hands
      // last offer becomes inactive, but filles becomes true
      let newOwner = fetchOwner(getOwnerId(to));
      cat.owner = newOwner.id;
      lastOffer.filled = true;
      lastOffer.active = false;
      lastOffer.save();
      provenance.save();
      newOwner.save();
      cat.save();
      return;
    }
  }

  if (lastRequest.active) {
    if (getAddress(lastRequest.from) == getAddress(to)) {
      let newOwner = fetchOwner(getOwnerId(to));
      cat.owner = newOwner.id;
      lastRequest.filled = true;
      lastRequest.active = false;
      lastRequest.save();
      provenance.save();
      newOwner.save();
      cat.save();
      return;
    }
  }
}

// * I have a cat, you [0x123..333] (or any1 [0x0]) can buy it from me for X wei
// * push to the list of offer prices, set active = true
export function handleAdoptionOffered(event: AdoptionOffered): void {
  let offerPriceId = getOfferPriceId(event.params.catId, event.transactionLogIndex);
  let provenanceId = getProvenanceId(event.params.catId);
  let offerPrice = createOfferPrice(offerPriceId, provenanceId, event);
  let provenance = getProvenance(provenanceId);

  // todo: this may not work as expected
  let lastOfferId = provenance.offerPrices[provenance.offerPrices.length - 1];
  let lastOffer = getOfferPrice(lastOfferId);
  lastOffer.active = false;
  lastOffer.save();
  provenance.save();

  // if an offer exists on the cat already, need to make it inactive first
  offerPrice.save();
}

// * Do not remove the OfferPrice, but set the active field to false
export function handleAdoptionOfferCancelled(
  event: AdoptionOfferCancelled
): void {
  let offerPriceId = getOfferPriceId(event.params.catId, event.transactionLogIndex);
  let offerPrice = getOfferPrice(offerPriceId);
  offerPrice.active = false;
  offerPrice.save();
}

// * I like a cat, and I am offering a cat owner, to buy it from (me) for price
export function handleAdoptionRequested(event: AdoptionRequested): void {
  let requestPriceId = getRequestPriceId(event.params.catId, event.transactionLogIndex);
  let provenanceId = getProvenanceId(event.params.catId);
  let requestPrice = createRequestPrice(requestPriceId, provenanceId, event);
  let provenance = getProvenance(provenanceId);

  // todo: this may not work as expected
  let lastRequestId = provenance.requestPrices[provenance.requestPrices.length - 1];
  let lastRequest = getRequestPrice(lastRequestId);
  lastRequest.active = false;
  lastRequest.save();
  provenance.save();

  requestPrice.save();
}

export function handleAdoptionRequestCancelled(
  event: AdoptionRequestCancelled
): void {
  let requestPriceId = getRequestPriceId(event.params.catId, event.transactionLogIndex);
  let requestPrice = getRequestPrice(requestPriceId);
  requestPrice.active = false;
  requestPrice.save();
}

export function handleCatNamed(event: CatNamed): void {
  let cat = getCat(getCatId(event.params.catId));
  cat.name = event.params.catName.toString();
  cat.save();
}

export function getCatId(catId: Bytes): string {
  return catId.toHex();
}

export function getOwnerId(owner: Address): string {
  return owner.toHex();
}

export function getOfferPriceId(catId: Bytes, transactionLogIndex: BigInt): string {
  return catId.toHex() + "::" + transactionLogIndex.toString();
}

export function getRequestPriceId(catId: Bytes, transactionLogIndex: BigInt): string {
  return catId.toHex() + "::" + transactionLogIndex.toString();
}

export function getProvenanceId(catId: Bytes): string {
  return getCatId(catId);
}

export function getAddress(address: Bytes): string {
  return address.toHex();
}