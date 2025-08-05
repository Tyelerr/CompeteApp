import { ILFInputGridInput } from "../components/LoginForms/LFInputsGrid";

export enum EIGameTypes{
  Ball8 = '8-ball',
  Ball9 = '9-ball',
  Ball10 = '10-ball',
  OnePocket = 'one-pocket',
  StraightPool = 'straight-pool',
  BankPool = 'bank-pool'
}
export const GameTypes = [
  {label:'8-Ball', value:EIGameTypes.Ball8},
  {label:'9-Ball', value:EIGameTypes.Ball9},
  {label:'10-Ball', value:EIGameTypes.Ball10},
  {label:'One Pocket', value:EIGameTypes.OnePocket},
  {label:'Straight Pool', value:EIGameTypes.StraightPool},
  {label:'Bank Pool', value:EIGameTypes.BankPool},
];

export enum ETournamentFormat{
  SingleElimination = 'single-elimination',
  DoubleElimination = 'double-elimination',
  RoundRobin = 'round-robin',
  DoubleRoundRobin = 'double-round-robin',
  SwissSystem = 'swiss-system',
  ChipTournament = 'chip-tournament'
}
export const TournametFormats = [
  {label:'Single Elimination', value:ETournamentFormat.SingleElimination},
  {label:'Double Elimination', value:ETournamentFormat.DoubleElimination},
  {label:'Round Robin', value:ETournamentFormat.RoundRobin},
  {label:'Double Round Robin', value:ETournamentFormat.DoubleRoundRobin},
  {label:'Swiss System', value:ETournamentFormat.SwissSystem},
  {label:'Chip Tournament', value:ETournamentFormat.ChipTournament},
];



export interface IAlert{
  id:string,
  created_at:string,
  updated_at:string,
  creator_id:string,
  name:string,
  preffered_game:string,
  fargo_range_from:number,
  fargo_range_to:number,
  max_entry_fee:number,
  location:string,
  reports_to_fargo:boolean,
  checked_open_tournament:boolean,
}




export enum ETournamentStatuses{
  Approved = 'approved',
  Pending = 'pending',
  Deleted = 'deleted',
  FargoRated = 'fargo-rated',
  OpenTournament = 'open-tournament',
}
export const TournamentStatusesForDropdown = [
  {label:'Approved', value:ETournamentStatuses.Approved},
  {label:'Pending', value:ETournamentStatuses.Pending},
  {label:'Deleted', value:ETournamentStatuses.Deleted},
  {label:'Fargo Rated', value:ETournamentStatuses.FargoRated},
  {label:'Open Tournament', value:ETournamentStatuses.OpenTournament},
];

export interface ITournament{
  id?:string,
  id_unique_number:number,
  uuid: string,
  tournament_name:string,
  game_type: string,
  format: string,
  director_name: string,
  description: string,
  equipment: string,
  custom_equipment: string,
  game_spot: string,
  venue: string,
  venue_lat: string,
  venue_lng: string,
  address: string,
  phone: string,

  // when thumbnail type is '' use thumbnail_url if not use the custom images
  thumbnail_type: string, 
  thumbnail_url: string,
  // start_date: string,
  start_date: string,
  strart_time: string,
  is_recurring: boolean,
  reports_to_fargo: boolean, 
  is_open_tournament: boolean,
  race_details: string,
  number_of_tables: number,
  table_size: ETableSizes,
  max_fargo: number,
  tournament_fee: number,
  created_at?: string,
  updated_at?: string,
  side_pots: ILFInputGridInput[][],
  // side_posts_json: string //for the
  status: ETournamentStatuses,

  // profiles hold the data for the user that created the tournament
  profiles: ICAUserData,

  // POINT(lat lng)
  point_location: string
}

export interface ILikedTournament{
  likeid: number,
  tournamentobject: ITournament
}

export enum ETableSizes{
  TableSize_7ft = "7ft",
  TableSize_8ft = "8ft",
  TableSize_9ft = "9ft",
  TableSize_10ft = "10ft",
  TableSize_12x6 = "12x6",
}
export const ItemsTableSizes:{label:string, value:string}[] = [
  {label: "7ft", value:ETableSizes.TableSize_7ft},
  {label: "8ft", value:ETableSizes.TableSize_8ft},
  {label: "9ft", value:ETableSizes.TableSize_9ft},
  {label: "10ft", value:ETableSizes.TableSize_10ft},
  {label: "12x6", value:ETableSizes.TableSize_12x6},
]

export enum ETournamentTimeDeleted{
  AllTime = '',
  Last7Days = 'last-7-days',
  Last30Days = 'last-30-days',
}

export interface IAnalytics{
  active_events: number,
  my_directors: number,
  my_tournaments: number,
  pending_approval: number, 
}

export interface IAnalyticsEventsRow{
  tournament_type: string,
  tournament_count: number
}


export interface ITournamentFilters{

  search?: string,

  game_type?: string,
  equipment?: string,
  equipment_custom?: string,

  
  daysOfWeek?: number[],

  entryFeeFrom?: number,
  entryFeeTo?: number,

  fargoRatingFrom?: number,
  fargoRatingTo?: number,

  minimun_required_fargo_games_10plus?: boolean,
  handicapped?: boolean,
  reports_to_fargo?: boolean,
  is_open_tournament?: boolean,

  venue?: string,
  lat?: string,
  lng?: string,
  radius?: number,

  format?: string,

  table_size?: string,

  filtersFromModalAreAplied?: boolean
}






export const TimeItems:{label:string, value:string}[] = [];
const TimeItemsDate = new Date();
TimeItemsDate.setHours(9, 0);
for(let i=0;i<25;i++){
  TimeItemsDate.setMinutes(TimeItemsDate.getMinutes()+30);
  const TimeItemDateValue:string = `${TimeItemsDate.getHours()<10?`0${TimeItemsDate.getHours()}`:TimeItemsDate.getHours()}:${TimeItemsDate.getMinutes()<10?`0${TimeItemsDate.getMinutes()}`:TimeItemsDate.getMinutes()}`;
  
  const LabelForTheTime:string = `${(TimeItemsDate.getHours()<=12?TimeItemsDate.getHours():TimeItemsDate.getHours()-12).toString()}:${TimeItemsDate.getMinutes()<10?`0${TimeItemsDate.getMinutes()}`:TimeItemsDate.getMinutes()}`;
   
  TimeItems.push({
    label: `${TimeItemDateValue==='12:00'?`${LabelForTheTime}${TimeItemsDate.getHours()<12?'AM':'PM'} (Noon)`:`${LabelForTheTime}${TimeItemsDate.getHours()<12?'AM':'PM'}`}`, 
    value: TimeItemDateValue
  });
}



export enum EUserStatus{
  StatusDeleted='deleted'
}
/*export enum EUserType{
  Client='client',
  Admin='admin'
}*/
export interface ICAUserData{
  id: string,
  created_at: string,
  created_at_formatted: string,
  user_name: string,
  email: string,
  name: string,
  preferred_game: string,
  skill_level: string,
  zip_code: string,
  favorite_player: string,
  favorite_game: string,
  role: EUserRole,
  status:EUserStatus,
  profile_image_url: string,
  id_auto: number
  // type:EUserType
}


export enum EUserRole{
  BasicUser='basic',
  CompeteAdmin='compete-admin',
  BarAdmin='bar-admin',
  TournamentDirector='tournament-director',
  MasterAdministrator='master-administrator',
}

export const UserRoles = [
  // {label:'All Roles', value:''},
  {label:'Basic User', value:EUserRole.BasicUser},
  {label:'Compete Admin', value:EUserRole.CompeteAdmin},
  {label:'Bar Admin', value:EUserRole.BarAdmin},
  {label:'Tournament Director', value:EUserRole.TournamentDirector},
  {label:'Master Administrator', value:EUserRole.MasterAdministrator},
];


export enum ECustomContentType{
  ContentFeaturedPlayer="featured-player",
  ContentFeaturedBar="featured-bar"
}
export interface ICustomContent{
  id:number, 
  created_at: string,
  name: string,
  label_about_the_person: string,
  address: string,
  description: string,
  list: ILFInputGridInput[][],
  labels: ILFInputGridInput[][],
  phone_number: string,
  type: ECustomContentType
}