import { EIGameTypes } from "./InterfacesGlobal";

export const TIMEOUT_DELAY_WHEN_SEARCH:number = 300;

export const COUNT_TOURNAMENTS_IN_PAGE:number = 20;

export const THUMBNAIL_CUSTOM = 'custom';


export const tournament_thumb_8_ball = require('./../assets/images/thumbnails/8-ball-custom.jpg');
export const tournament_thumb_9_ball = require('./../assets/images/thumbnails/9-ball-custom.jpg');
export const tournament_thumb_10_ball = require('./../assets/images/thumbnails/10-ball-custom.jpg');
export const tournament_thumb_one_pocket = require('./../assets/images/thumbnails/10-ball-custom.jpg');
export const tournament_thumb_straight_pool = require('./../assets/images/thumbnails/10-ball-custom.jpg');
export const tournament_thumb_bank_pool = require('./../assets/images/thumbnails/10-ball-custom.jpg');


export const getThurnamentStaticThumb = (gameType: string)=>{
  if(gameType===EIGameTypes.Ball8)return tournament_thumb_8_ball;
  else if(gameType===EIGameTypes.Ball9)return tournament_thumb_9_ball;
  else if(gameType===EIGameTypes.Ball10)return tournament_thumb_10_ball;
  else if(gameType===EIGameTypes.OnePocket)return tournament_thumb_one_pocket;
  else if(gameType===EIGameTypes.StraightPool)return tournament_thumb_straight_pool;
  else if(gameType===EIGameTypes.BankPool)return tournament_thumb_bank_pool;
  return null;
}


export const fargo_rated_tournaments_thumb = require('./../assets/images/thumbnails/fargo-rated-tournaments.jpg');