import {
  CatRescued,
  AdoptionOffered,
  AdoptionRequested,
} from "../generated/MoonCatRescue/MoonCatRescue";

import {
  Cat,
  Owner,
  RequestPrice,
  OfferPrice,
  Provenance,
} from "../generated/schema";

export const createCat = (catId: string, ownerId: string, event: CatRescued): Cat => {
  let cat = new Cat(catId);
  let owner = fetchOwner(ownerId);
  owner.save();
  cat.owner = owner.id;
  cat.rescueTimestamp = event.block.timestamp;
  cat.isWrapped = false;
  return <Cat>cat;
}

export const getCat = (catId: string): Cat => {
  let cat = Cat.load(catId);
  return <Cat>cat;
};

export const createOwner = (ownerId: string): Owner => {
  let owner = new Owner(ownerId);
  return <Owner>owner;
}

export const getOwner = (ownerId: string): Owner => {
  let owner = Owner.load(ownerId);
  return <Owner>owner;
};

export const fetchOwner = (ownerId: string): Owner => {
  let owner = getOwner(ownerId);
  if (owner == null) {
    owner = createOwner(ownerId);
  }
  return <Owner>owner;
}

export const createRequestPrice = (requestId: string, provenanceId: string, event: AdoptionRequested): RequestPrice => {
  let requestPrice = new RequestPrice(requestId);
  let provenance = fetchProvenance(provenanceId);
  provenance.save();
  requestPrice.provenance = provenance.id;
  requestPrice.price = event.params.price;
  requestPrice.from = event.params.from;
  requestPrice.timestamp = event.block.timestamp;
  requestPrice.filled = false;
  requestPrice.active = true;
  return <RequestPrice>requestPrice;
}

export const getRequestPrice = (requestId: string): RequestPrice => {
  let requestPrice = RequestPrice.load(requestId);
  return <RequestPrice>requestPrice;
}

export const createOfferPrice = (offerId: string, provenanceId: string, event: AdoptionOffered): OfferPrice => {
  let offerPrice = new OfferPrice(offerId);
  let provenance = fetchProvenance(provenanceId);
  provenance.save();
  offerPrice.provenance = provenance.id;
  offerPrice.price = event.params.price;
  offerPrice.to = event.params.toAddress;
  offerPrice.timestamp = event.block.timestamp;
  offerPrice.filled = false;
  offerPrice.active = true;
  return <OfferPrice>offerPrice;
}

export const getOfferPrice = (requestId: string): OfferPrice => {
  let offerPrice = OfferPrice.load(requestId);
  return <OfferPrice>offerPrice;
}

export const createProvenance = (provenanceId: string): Provenance => {
  let provenance = new Provenance(provenanceId);
  return <Provenance>provenance;
}

export const getProvenance = (provenanceId: string): Provenance => {
  let provenance = Provenance.load(provenanceId);
  return <Provenance>provenance;
}

export const fetchProvenance = (provenanceId: string): Provenance => {
  let provenance = getProvenance(provenanceId);
  if (provenance == null) {
    provenance = createProvenance(provenanceId);
  }
  return <Provenance>provenance;
}