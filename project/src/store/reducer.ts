import {createReducer} from '@reduxjs/toolkit';
import {changeCity, changeOffer, selectPoint, changeOption, loadOffers, setOffersDataLoadingStatus, requireAuthorization} from './action';
import {FIRST_CITY_STEP, AuthorizationStatus} from '../components/const/const';
import {Offers} from '../types/offer';

//const FIRST_CITY_OFFERS = store.filter((offer) => offer.city.name === 'Paris');

type InitalState = {
  firstCity: string;
  offers: Offers;
  data: Offers;
  selectPoint: number;
  sortType: string;
  authorizationStatus: AuthorizationStatus;
  isOffersDataLoading: boolean;
}

const initialState: InitalState = {
  firstCity: FIRST_CITY_STEP,
  offers: [],
  data: [],
  selectPoint: 0,
  sortType: 'Popular',
  authorizationStatus: AuthorizationStatus.Unknown,
  isOffersDataLoading: false,
};

function getSortOffers(a:number, b:number) {
  return (a - b);
}

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(changeCity, (state, action) => {
      const {visibleCity} = action.payload;
      state.firstCity = visibleCity;
    })
    .addCase(changeOffer, (state, action) => {
      const {checkCity} = action.payload;
      state.offers = state.data.filter((offer) => offer.city.name === checkCity);
    })
    .addCase(selectPoint, (state, action) => {
      const {selectedPoint} = action.payload;
      state.selectPoint = selectedPoint;
    })
    .addCase(changeOption, (state, action) => {
      const {sortType} = action.payload;

      if (sortType === 'Price: low to high') {
        const sortOffers = state.offers.sort((a, b) => getSortOffers(a.price, b.price));
        state.offers = sortOffers;
      } else if (sortType === 'Price: high to low') {
        const sortOffers = state.offers.sort((a, b) => getSortOffers(b.price, a.price));
        state.offers = sortOffers;
      } else if (sortType === 'Top rated first') {
        const sortOffers = state.offers.sort((a, b) => getSortOffers(b.rating, a.rating));
        state.offers = sortOffers;
      } else {
        const sortOffers = state.offers.sort((a, b) => getSortOffers(a.id, b.id));
        state.offers = sortOffers;
      }
      state.sortType = sortType;
    })
    .addCase(loadOffers, (state, action) => {
      state.offers = action.payload;
      state.data = action.payload;
    })
    .addCase(setOffersDataLoadingStatus, (state, action) => {
      state.isOffersDataLoading = action.payload;
    })
    .addCase(requireAuthorization, (state, action) => {
      state.authorizationStatus = action.payload;
    });
});

export {reducer};
