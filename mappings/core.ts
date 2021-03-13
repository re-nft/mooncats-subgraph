import { CatAdopted, CatRescued } from "../generated/MoonCatRescue/MoonCatRescue";
import { fetchCat, fetchMoonRescuer } from "./helpers";

export function handleCatAdopted(event: CatAdopted): void {
  let catAdoptedParams = event.params;
  // will create a cat if it doesn't exist
  let cat = fetchCat(catAdoptedParams.catId);
  let moonRescuer = fetchMoonRescuer(catAdoptedParams.to);
  let poorFella = fetchMoonRescuer(catAdoptedParams.from);

  let winnerCats = moonRescuer.cats;
  let poorSapCats = poorFella.cats;

  let poorSapCatsRemoveIx = poorSapCats.indexOf(
    catAdoptedParams.catId.toHexString()
  );
  poorSapCats.splice(poorSapCatsRemoveIx, 1);
  poorFella.cats = poorSapCats;

  winnerCats.push(catAdoptedParams.catId.toHexString());
  moonRescuer.cats = winnerCats;

  cat.inMyWallet = true;

  cat.save();
  poorFella.save();
  moonRescuer.save();
}

// CatRescued(address indexed to, bytes5 indexed catId)
export function handleCatRescued(event: CatRescued): void {
  let catRescuedParams = event.params;
  // will create a cat if it doesn't exist
  let cat = fetchCat(catRescuedParams.catId);
  let moonRescuer = fetchMoonRescuer(catRescuedParams.to);

  let winnerCats = moonRescuer.cats;
  winnerCats.push(catRescuedParams.catId.toHexString());
  moonRescuer.cats = winnerCats;

  cat.inMyWallet = false;

  cat.save();
  moonRescuer.save();
}
