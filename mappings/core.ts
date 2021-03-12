import { CatAdopted } from "../generated/MoonCatRescue/MoonCatRescue";
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

  poorFella.save();
  moonRescuer.save();
}
